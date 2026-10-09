import type {MathSource,MathReading} from '../../lib/math-curriculum-types';
const checked='2026-10-10';
export const dailySources:MathSource[]=[
 {id:'d-matrix',title:'The Matrix Cookbook',url:'https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf',version:'Petersen & Pedersen, 15 November 2012',access:'free official',verified:checked,sections:'Gaussian distributions, block matrices, matrix identities and determinants; background for the independently derived daily examples.'},
 {id:'d-sure',title:'The James-Stein Estimator / Ước lượng James–Stein',url:'https://stat210a.berkeley.edu/fall-2024/reader/jamesstein.html',version:'Berkeley Stat 210A, Fall 2024',access:'free official',verified:checked,sections:'Stein’s unbiased risk estimate (SURE).'},
 {id:'d-conformal',title:'Conformal Prediction / Dự đoán conformal',url:'https://www.stat.berkeley.edu/~ryantibs/statlearn-s23/lectures/conformal.pdf',version:'Ryan Tibshirani, Berkeley statistical learning, Spring 2023',access:'free official',verified:checked,sections:'Split conformal prediction and calibration rank.'},
 {id:'d-tweedie',title:'Tweedie’s Formula — Stanford EE367 / Công thức Tweedie — Stanford EE367',url:'https://stanford.edu/class/ee367/slides/lecture12.pdf',version:'Stanford EE367, lecture 12, university-hosted slides',access:'free official',verified:checked,sections:'Tweedie’s formula for additive Gaussian corruption; companion derivation, not the original Efron paper.'},
 {id:'d-evalues',title:'E-values: Calibration, combination, and applications',url:'https://arxiv.org/pdf/1912.06116',version:'Vovk & Wang, arXiv:1912.06116',access:'free official',verified:checked,sections:'E-value definition and arithmetic averaging under arbitrary dependence.'},
];
export function extensionReading(id:string):MathReading[]{
 const sourceId=id==='daily-stein-risk'?'d-sure':id==='daily-split-conformal-rank'?'d-conformal':id==='daily-tweedie-normal-means'?'d-tweedie':id==='daily-e-value-mixtures'?'d-evalues':['daily-discrete-lyapunov','daily-information-filter','daily-missing-observation','daily-backward-simulation','daily-correlated-sensor-fusion','daily-posterior-predictive-mixture'].includes(id)?'a-filter':'d-matrix';
 return [{sourceId,section:dailySources.find(s=>s.id===sourceId)?.sections??'Linear Gaussian conditioning and filtering; background for the daily derivation.',required:false,purpose:{en:'Optional mathematical background; the lesson and solution are self-contained.',vi:'Kiến thức nền tham khảo; bài giảng và lời giải đã có đầy đủ trên web.'}}];
}
export function introductoryReading(id:string):MathReading[]|undefined{
 const entries:Record<string,[string,string]>={
  'f-w001-e1':['f-1801sc','Differentiation: definition and chain rule'],
  'f-w001-e2':['f-1806sc','Column space, nullspace and rank'],
  'f-w001-e3':['f-6041sc','Bayes rule and conditional probability'],
  'f-w001-e4':['f-book-proof','Chapter 2: logic and quantified statements'],
  'f-w001-e5':['f-1805','Random variables, expectation and sample averages'],
 };
 const entry=entries[id];return entry?[{sourceId:entry[0],section:entry[1],required:false,purpose:{en:'Optional background.',vi:'Kiến thức nền tham khảo.'}}]:undefined;
}
