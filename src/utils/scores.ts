function getMean(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function standardDeviation(arr: number[]) {
  const average = getMean(arr);

  const squaredDifferences = arr.map((value) => (value - average) ** 2);
  return Math.sqrt(getMean(squaredDifferences));
}

export function getZScores(arr: number[]) {
  const average = getMean(arr);
  const standardDev = standardDeviation(arr);
  return arr.map((value) => (value - average) / standardDev);
}