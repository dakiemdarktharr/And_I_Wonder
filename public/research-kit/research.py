"""Free, standard-library research starter (Python 3.10+).

python research.py --self-test
python research.py --out results
python research.py --out results --csv path/to/F-F_Research_Data_Factors.csv

Default runs validation only. Inspect trials.csv and write a plan, then:
python research.py --out final --csv results/source.csv --test --lookback 3 --ridge 1

--test is an explicit disclosure, not a secure holdout service. Once viewed,
further tuning on the same test is exploratory. This is not investment advice
or evidence of profitable alpha. The free source contains revised aggregates,
not point-in-time individual equities. No credentials or paid packages needed.
"""
import argparse
import csv
import hashlib
import io
import json
import math
import pathlib
import platform
import random
import sys
import unittest
import urllib.request
import zipfile
from datetime import datetime, timezone

SOURCE = 'https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/F-F_Research_Data_Factors_CSV.zip'


def parse_csv(raw):
    rows = []
    for fields in csv.reader(raw.decode('utf-8-sig').splitlines()):
        if not fields or not fields[0].strip():
            continue
        date = fields[0].strip()
        if len(date) != 6 or not date.isdigit():
            if rows:
                break
            continue
        if len(fields) < 5 or not 1 <= int(date[4:]) <= 12:
            raise ValueError('Invalid monthly row')
        excess, rf = float(fields[1]), float(fields[4])
        if not all(math.isfinite(x) and x > -99 for x in (excess, rf)):
            raise ValueError('Missing/invalid return')
        if rows and date <= rows[-1]['date']:
            raise ValueError('Nonascending or duplicate month')
        rows.append(dict(date=date, excess=excess / 100, rf=rf / 100))
    if len(rows) < 120:
        raise ValueError('At least 120 monthly rows required')
    return rows


def feature(rows, index, lag):
    return sum(r['excess'] for r in rows[index-lag:index]) / lag


def fit(rows, lag, ridge):
    end = int(len(rows) * .6)
    pairs = [(feature(rows, i, lag), rows[i]['excess']) for i in range(lag, end)]
    mx = sum(x for x, _ in pairs) / len(pairs)
    my = sum(y for _, y in pairs) / len(pairs)
    scale = math.sqrt(sum((x-mx)**2 for x, _ in pairs) / len(pairs)) or 1
    slope = sum((x-mx)/scale * (y-my) for x, y in pairs) / (len(pairs) * (1+ridge))
    return mx, my, scale, slope


def backtest(rows, lag=3, ridge=1., cost_bps=10., test=False):
    if lag not in (1, 3, 12) or ridge < 0 or not 0 <= cost_bps <= 1000:
        raise ValueError('Invalid parameters')
    mx, mean, scale, slope = fit(rows, lag, ridge)
    begin, end = (int(len(rows)*.8), len(rows)) if test else (int(len(rows)*.6), int(len(rows)*.8))
    previous, equity, benchmark_equity = 0, 1., 1.
    output = []
    for i in range(begin, end):
        prediction = mean + slope * (feature(rows, i, lag)-mx)/scale
        position = int(prediction > 0)
        turnover = abs(position-previous) + (position if i == end-1 else 0)
        net = rows[i]['rf'] + position * rows[i]['excess'] - cost_bps/10000*turnover
        benchmark = rows[i]['rf'] + rows[i]['excess'] - cost_bps/10000*((i == begin)+(i == end-1))
        equity *= 1+net
        benchmark_equity *= 1+benchmark
        output.append(dict(date=rows[i]['date'], prediction=prediction, actual=rows[i]['excess'],
                           position=position, turnover=turnover, net=net, benchmark=benchmark,
                           equity=equity, benchmark_equity=benchmark_equity))
        previous = position
    metrics = dict(mse=sum((p['prediction']-p['actual'])**2 for p in output)/len(output),
                   baseline_mse=sum((mean-p['actual'])**2 for p in output)/len(output),
                   net_return=equity-1, benchmark_return=benchmark_equity-1,
                   partition='test' if test else 'validation', lookback=lag, ridge=ridge, cost_bps=cost_bps)
    return output, metrics


def black_scholes(spot=100., strike=100., rate=.05, vol=.2, years=1.):
    if spot <= 0 or strike <= 0 or vol < 0 or years < 0:
        raise ValueError('Invalid price inputs')
    discount = strike*math.exp(-rate*years)
    if years == 0 or vol == 0:
        return max(spot-discount, 0)
    cdf = lambda x: .5*(1+math.erf(x/math.sqrt(2)))
    d1 = (math.log(spot/strike)+(rate+vol*vol/2)*years)/(vol*math.sqrt(years))
    return spot*cdf(d1)-discount*cdf(d1-vol*math.sqrt(years))


def implied_vol(quote, spot=100., strike=100., rate=.05, years=1., tolerance=1e-8):
    if years <= 0 or not max(spot-strike*math.exp(-rate*years), 0) < quote < spot:
        raise ValueError('Strict interior price and positive maturity required')
    low, high = 0., 3.
    if black_scholes(spot, strike, rate, high, years) < quote:
        raise ValueError('No bracket within sigma <= 3')
    for _ in range(200):
        mid = (low+high)/2
        residual = black_scholes(spot, strike, rate, mid, years)-quote
        if abs(residual) < tolerance:
            return dict(vol=mid, residual=residual, bracket=[low, high])
        if residual > 0:
            high = mid
        else:
            low = mid
    raise ValueError('Iteration limit')


def bootstrap(points, block=6, replicates=1000, seed=17):
    rng = random.Random(seed)
    values = [p['net']-p['benchmark'] for p in points]
    estimates = []
    for _ in range(replicates):
        sample = []
        while len(sample) < len(values):
            start = rng.randrange(len(values))
            sample.extend(values[(start+j) % len(values)] for j in range(block))
        estimates.append(sum(sample[:len(values)])/len(values))
    estimates.sort()
    return dict(mean=sum(values)/len(values), lower=estimates[int(.025*replicates)],
                upper=estimates[int(.975*replicates)], block=block, seed=seed,
                limitation='Stationary-dependence approximation; no multiple-selection correction')


def write_csv(path, records):
    with path.open('w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=list(records[0]))
        writer.writeheader()
        writer.writerows(records)


class Checks(unittest.TestCase):
    def fixture(self):
        rng = random.Random(12)
        return [dict(date=str(i), excess=.01+rng.gauss(0, .03), rf=.001) for i in range(300)]

    def test_pricing_fixture_and_inverse(self):
        self.assertAlmostEqual(black_scholes(), 10.450583572185565, places=10)
        self.assertAlmostEqual(implied_vol(black_scholes())['vol'], .2, places=8)
        self.assertEqual(black_scholes(years=0), 0)
        with self.assertRaises(ValueError):
            implied_vol(110)

    def test_no_future_inputs(self):
        rows = self.fixture()
        old, _ = backtest(rows)
        rows[225]['excess'] = .95
        changed, _ = backtest(rows)
        self.assertEqual([p['prediction'] for p in old[:46]], [p['prediction'] for p in changed[:46]])

    def test_costs(self):
        rows = self.fixture()
        cheap, _ = backtest(rows, cost_bps=0)
        costly, _ = backtest(rows, cost_bps=100)
        self.assertTrue(all(b['net'] <= a['net'] for a, b in zip(cheap, costly)))
        self.assertEqual([p['position'] for p in cheap], [p['position'] for p in costly])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--self-test', action='store_true')
    parser.add_argument('--csv', type=pathlib.Path)
    parser.add_argument('--out', type=pathlib.Path, default=pathlib.Path('results'))
    parser.add_argument('--test', action='store_true')
    parser.add_argument('--lookback', type=int, choices=[1, 3, 12], default=3)
    parser.add_argument('--ridge', type=float, default=1.)
    parser.add_argument('--cost-bps', type=float, default=10.)
    args = parser.parse_args()
    if args.self_test:
        suite = unittest.defaultTestLoader.loadTestsFromTestCase(Checks)
        return 0 if unittest.TextTestRunner(verbosity=2).run(suite).wasSuccessful() else 1
    if args.out.exists() and any(args.out.iterdir()):
        parser.error('Output directory is not empty. Choose a new run directory to retain trial history.')
    if args.csv:
        raw = args.csv.read_bytes()
    else:
        with urllib.request.urlopen(SOURCE, timeout=20) as response:
            zipped = response.read(2_000_001)
        if len(zipped) > 2_000_000:
            raise ValueError('Oversized source archive')
        with zipfile.ZipFile(io.BytesIO(zipped)) as archive:
            entry = next(e for e in archive.infolist() if e.filename.lower().endswith('.csv'))
            if entry.file_size > 5_000_000:
                raise ValueError('Oversized CSV')
            raw = archive.read(entry)
    rows = parse_csv(raw)
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out/'source.csv').write_bytes(raw)
    manifest = dict(source=SOURCE, sha256=hashlib.sha256(raw).hexdigest(),
                    script_sha256=hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(),
                    python=sys.version, platform=platform.platform(),
                    retrieved_at=datetime.now(timezone.utc).isoformat(), observations=len(rows),
                    units='Decimal returns converted from provider percentages',
                    limitations='Revised aggregate factors. FIZ/CIZ change from January 2025. Not point-in-time stocks.',
                    independent_verification='unverified', holdout_exposed=args.test)
    trials = [backtest(rows, lag, ridge, args.cost_bps)[1] for lag in (1, 3, 12) for ridge in (0, 1, 10)]
    points, metrics = backtest(rows, args.lookback, args.ridge, args.cost_bps, args.test)
    write_csv(args.out/'trials.csv', trials)
    write_csv(args.out/'returns.csv', points)
    (args.out/'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    (args.out/'metrics.json').write_text(json.dumps(dict(metrics=metrics, interval=bootstrap(points)), indent=2), encoding='utf-8')
    print(json.dumps(metrics, indent=2))
    print('Retain this run directory. Self-reported results; no independent verification.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
