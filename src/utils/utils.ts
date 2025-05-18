export const BASE_URL = 'http://localhost:5173/'

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

export const accumulateValues = (properties: {[name: string]: string;}[]) => properties?.reduce((acc: {[name: string]: number}, feature) => {
  Object.entries(feature).forEach(([key, value]) => {
    if (typeof value === 'number') {
      acc[key] = (acc[key] || 0) + value;
    }
  });
  return acc;
}, {});

export const extractObjects = (features:{properties: {[name: string]: string;}}[], attribute: string) => 
  features?.map((feature: {[properties:string]: {[name: string]: string;}}) => feature[attribute]);

export const lvlStatDefault = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

export const enabledSettings = {
  scrollZoom: true,
  boxZoom: true,
  dragRotate: true,
  dragPan: true,
  keyboard: true,
  doubleClickZoom: true,
  touchZoomRotate: true,
  touchPitch: true,
}
export const disabledSettings = {    
  scrollZoom: false,
  boxZoom: false,
  dragRotate: false,
  dragPan: false,
  keyboard: false,
  doubleClickZoom: false,
  touchZoomRotate: false,
  touchPitch: false,
}

export const simpsonsIndex = (values: number[]) => {
  // Filter out zeros (optional, depending on your use case)
  const filteredValues = values.filter((val: number) => val > 0);
  
  const total = filteredValues.reduce((sum, val) => sum + val, 0);
  
  if (total === 0) return 0; // Edge case: avoid division by zero
  
  let sumOfSquares = 0;
  for (const val of filteredValues) {
    const proportion = val / total;
    sumOfSquares += proportion * proportion;
  }
  
  return (1 - sumOfSquares).toFixed(2);
}

export const reverseSimpsonsIndex = (values: number[]) => {
  // Filter out zeros (optional, depending on your use case)
  const filteredValues = values.filter((val: number) => val > 0);
  
  const total = filteredValues.reduce((sum, val) => sum + val, 0);
  
  if (total === 0) return 0; // Edge case: avoid division by zero
  
  let sumOfSquares = 0;
  for (const val of filteredValues) {
    const proportion = val / total;
    sumOfSquares += proportion * proportion;
  }
  
  return (sumOfSquares).toFixed(2);
}

export function getPublicImage(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}