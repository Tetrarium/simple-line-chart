export function calculateMean(arr: (number | undefined)[]) {
  const numbers = arr.filter(num => num !== undefined);

  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

export function calculateStandardDeviation(arr: (number | undefined)[]) {
  const numbers = arr.filter(num => num !== undefined);

  const average = calculateMean(numbers);

  const squaredDifferences = numbers.map((value) => (value - average) ** 2);
  return Math.sqrt(calculateMean(squaredDifferences));
}

export function getZScores(arr: (number | undefined)[]) {
  const average = calculateMean(arr);
  const standardDev = calculateStandardDeviation(arr);
  return arr.map((value) => value && (value - average) / standardDev);
}