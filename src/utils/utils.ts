export const indexOfMax = (arr: number[]) => {
  let max = arr[0];
  let maxIndex = 0;
  for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }
  return maxIndex;
}

export const accumulateValues = features => features.reduce((acc, feature) => {
  Object.entries(feature).forEach(([key, value]) => {
    if (typeof value === 'number') {
      acc[key] = (acc[key] || 0) + value;
    }
  });
  return acc;
}, {});

export const extractObjects = (features, attribute) => 
  features.map(feature => feature[attribute]);