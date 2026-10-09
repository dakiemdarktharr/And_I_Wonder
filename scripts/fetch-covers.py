"""Render compact, genuine book cover thumbnails from official source pages.

PDFs are streamed to a temporary directory, only page one is rasterized, and the
PDF bytes are deleted when the temporary directory closes. HTML editions use
an official front-cover image when the source page exposes one; otherwise the
manifest records a truthful title-page fallback instead of inventing artwork.

Requires Python 3 and Poppler's pdftoppm. Run from the application directory:
    python scripts/fetch-covers.py
"""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import subprocess
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RESOURCES_PATH = ROOT / "data" / "resources.json"
MANIFEST_PATH = ROOT / "data" / "resource-covers.json"
COVERS_DIR = ROOT / "public" / "covers"
USER_AGENT = "And-I-Wonder-resource-thumbnail/1.0 (educational site)"

# Genuine front covers exposed by official publisher pages. The Stat 110
# resource page is linked from Harvard's official Statistics 110 site; the
# publisher image is the matching CRC Press jacket (ISBN 9781138369917).
OFFICIAL_PUBLISHER_COVERS = {
    "stat110-book": {
        "image": "https://images.routledge.com/common/jackets/crclarge/978113836/9781138369917.jpg",
        "page": "https://www.routledge.com/Introduction-to-Probability--Second-Edition/Blitzstein-Hwang/p/book/9781138369917",
        "label": "CRC Press front cover for ISBN 9781138369917",
        "metadata": "Publisher front cover; ISBN 9781138369917",
        "contextPage": "https://stat110.hsites.harvard.edu/",
    },
    "isl-python": {
        "image": "https://media.springernature.com/full/springer-static/cover-hires/book/978-3-031-38747-0",
        "page": "https://link.springer.com/book/10.1007/978-3-031-38747-0",
        "label": "Springer Nature front cover for ISBN 978-3-031-38747-0",
        "metadata": "Publisher front cover; ISBN 978-3-031-38747-0",
    },
    "elements-statistical-learning": {
        "image": "https://media.springernature.com/full/springer-static/cover-hires/book/978-0-387-84858-7",
        "page": "https://link.springer.com/book/10.1007/978-0-387-84858-7",
        "label": "Springer Nature front cover for ISBN 978-0-387-84858-7",
        "metadata": "Publisher front cover; ISBN 978-0-387-84858-7",
    },
}

# This image is linked by the official HTML edition itself.
OFFICIAL_HTML_COVERS = {
    "forecasting-principles-practice": {
        "image": "https://otexts.com/fpp3/figs/fpp3_front_cover.jpg",
        "page": "https://otexts.com/fpp3/",
        "label": "Front cover displayed by the official HTML edition",
    }
}

def request(url: str):
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": USER_AGENT}),
        timeout=90,
    )


def digest(path: Path) -> str:
    hasher = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def image_dimensions(path: Path) -> tuple[int | None, int | None]:
    try:
        from PIL import Image

        with Image.open(path) as image:
            return image.width, image.height
    except Exception:
        return None, None


def write_official_publisher_cover(resource: dict, target: Path) -> dict | None:
    cover = OFFICIAL_PUBLISHER_COVERS.get(resource["id"])
    if not cover:
        return None

    with request(cover["image"]) as response:
        content_type = response.headers.get("Content-Type", "").split(";")[0].lower()
        if not content_type.startswith("image/"):
            raise ValueError(f"Expected official cover image, received {content_type or 'unknown content'}")
        target.write_bytes(response.read())

    width, height = image_dimensions(target)
    provenance = {
        "captureType": "official-publisher-cover",
        "sourcePageUrl": cover["page"],
        "sourceAssetUrl": cover["image"],
        "sourcePageLabel": cover["label"],
        "sourcePageNumber": None,
        "pageMetadata": cover["metadata"],
        "width": width,
        "height": height,
    }
    if cover.get("contextPage"):
        provenance["officialContextPageUrl"] = cover["contextPage"]
    return provenance


def write_html_cover(resource: dict, target: Path, page_url: str) -> dict | None:
    source_image = None
    label = None
    if resource["id"] in OFFICIAL_HTML_COVERS:
        cover = OFFICIAL_HTML_COVERS[resource["id"]]
        source_image, page_url, label = cover["image"], cover["page"], cover["label"]
    else:
        # Some official HTML editions embed their genuine first-page image.
        # Only use an image when it is embedded on the listed source page.
        try:
            with request(resource["url"]) as response:
                html = response.read(400_000).decode("utf-8", "replace")
            image_urls = re.findall(
                r'<img\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*>',
                html,
                flags=re.IGNORECASE,
            )
            candidate = next(
                (item for item in image_urls if "drive.google.com/drive-viewer/" in item),
                None,
            )
            if candidate:
                source_image = urllib.parse.urljoin(resource["url"], candidate)
                label = "First-page image embedded by the official HTML edition"
        except Exception:
            pass

    if not source_image:
        return None

    with request(source_image) as response:
        content_type = response.headers.get("Content-Type", "").split(";")[0].lower()
        if not content_type.startswith("image/"):
            return None
        target.write_bytes(response.read())

    width, height = image_dimensions(target)
    return {
        "captureType": "official-html-image",
        "sourcePageUrl": page_url,
        "sourceAssetUrl": source_image,
        "sourcePageLabel": label,
        "sourcePageNumber": None,
        "pageMetadata": "Official HTML front cover / embedded first-page image",
        "width": width,
        "height": height,
    }


def render_pdf_page(resource: dict, target: Path, pdftoppm: str) -> dict:
    with tempfile.TemporaryDirectory(prefix="and-i-wonder-cover-") as temp_name:
        temp = Path(temp_name)
        pdf_path = temp / "source.pdf"
        with request(resource["url"]) as response, pdf_path.open("wb") as pdf_file:
            content_type = response.headers.get("Content-Type", "").split(";")[0].lower()
            if content_type != "application/pdf" and not resource["url"].lower().endswith(".pdf"):
                raise ValueError(f"Expected an official PDF, received {content_type or 'unknown content'}")
            shutil.copyfileobj(response, pdf_file)

        output_prefix = temp / "page"
        subprocess.run(
            [
                pdftoppm,
                "-f",
                "1",
                "-l",
                "1",
                "-singlefile",
                "-jpeg",
                "-jpegopt",
                "quality=86",
                "-scale-to",
                "1000",
                str(pdf_path),
                str(output_prefix),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
        )
        rendered = output_prefix.with_suffix(".jpg")
        if not rendered.exists():
            raise RuntimeError("Poppler did not produce the first-page thumbnail")
        shutil.copyfile(rendered, target)

        width, height = image_dimensions(target)
        info = subprocess.run(
            ["pdfinfo", "-f", "1", "-l", "1", str(pdf_path)],
            check=True,
            capture_output=True,
            text=True,
        ).stdout
        pages = re.search(r"^Pages:\s+(\d+)", info, flags=re.MULTILINE)
        first_page_size = re.search(r"^Page\s+1 size:\s+(.+)$", info, flags=re.MULTILINE)
        return {
            "captureType": "pdf-page-1",
            "sourcePageUrl": resource["url"],
            "sourceAssetUrl": None,
            "sourcePageLabel": "Page 1 rendered from the official source PDF",
            "sourcePageNumber": 1,
            "pageMetadata": {
                "pdfPageNumber": 1,
                "pdfPageCount": int(pages.group(1)) if pages else None,
                "pdfPageSize": first_page_size.group(1).strip() if first_page_size else None,
            },
            "width": width,
            "height": height,
        }


def main() -> None:
    pdftoppm = shutil.which("pdftoppm")
    if not pdftoppm or not shutil.which("pdfinfo"):
        raise SystemExit("Poppler is required: pdftoppm and pdfinfo must be on PATH.")
    resources = json.loads(RESOURCES_PATH.read_text(encoding="utf-8"))
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []

    for resource in resources:
        if resource["kind"] != "book":
            continue
        asset = f"/covers/{resource['id']}.jpg"
        target = COVERS_DIR / f"{resource['id']}.jpg"
        page_url = resource["url"]
        base = {
            "resourceId": resource["id"],
            "asset": asset,
            "title": resource["title"],
            "sourceAttribution": resource.get("author", "Official resource publisher"),
            "sourceDocumentUrl": resource["url"],
        }
        try:
            provenance = write_official_publisher_cover(resource, target)
            if provenance is None:
                if urllib.parse.urlsplit(resource["url"]).path.lower().endswith(".pdf"):
                    provenance = render_pdf_page(resource, target, pdftoppm)
                else:
                    provenance = write_html_cover(resource, target, page_url)
                if provenance is None:
                    manifest.append(
                        {
                            **base,
                            "asset": None,
                            "captureType": "truthful-title-page-fallback",
                            "sourcePageUrl": resource["url"],
                            "sourceAssetUrl": None,
                            "sourcePageNumber": None,
                            "pageMetadata": "Official HTML edition; no verified cover/title-page image was available.",
                            "fallbackReason": "The official source is an HTML edition without a verified cover image. The UI displays the source title and author as a clearly labelled web-edition title page.",
                        }
                    )
                    continue
            manifest.append(
                {
                    **base,
                    **provenance,
                    "sha256": digest(target),
                    "bytes": target.stat().st_size,
                }
            )
            print(f"{resource['id']}: {provenance['captureType']} ({target.stat().st_size:,} bytes)")
        except Exception as error:
            target.unlink(missing_ok=True)
            manifest.append(
                {
                    **base,
                    "asset": None,
                    "captureType": "truthful-title-page-fallback",
                    "sourcePageUrl": resource["url"],
                    "sourceAssetUrl": None,
                    "sourcePageNumber": None,
                    "pageMetadata": "Official source page retained; page-one thumbnail could not be retrieved.",
                    "fallbackReason": f"Thumbnail extraction failed: {type(error).__name__}. The UI displays the verified source title and author as a title page.",
                }
            )
            print(f"{resource['id']}: fallback ({type(error).__name__}: {error})")

    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(manifest)} book entries to {MANIFEST_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
