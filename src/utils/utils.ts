import { Chart } from "chart.js";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { intersection } from "martinez-polygon-clipping";
import { useEffect, useState } from "react";

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

export const useDebounce = (value: number[], delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const extractCoord = (geometry: Geometry) => {
  // console.log(geometry.type)
  if (geometry.type === 'MultiPolygon'||geometry.type === 'Polygon') {
    return geometry.coordinates
  } else return null
}


export const booleanIntersection = (a: Feature<Geometry,GeoJsonProperties>,b:Feature<Geometry,GeoJsonProperties>) => {
  const ag = extractCoord(a.geometry)
  const bg = extractCoord(b.geometry)
  if (!ag || !bg) {
    return false
  }
  const r = intersection(ag,bg)
  if (r && r.length>0) {
    return true
  } else return false
}

export const legendPlugin = {
  id: 'colorSquarePlugin',
  afterDraw(chart: Chart) {
    const ctx = chart.ctx;
    const datasetMeta = chart.getDatasetMeta(0);
    const indexScale = chart.scales['y']; // since indexAxis: 'y'

    if (!ctx || !datasetMeta || !datasetMeta.data || !indexScale) return;

    datasetMeta.data.forEach((bar, index) => {
      const barModel = bar;
      const backgroundColor = barModel.options?.backgroundColor ?? '#000000';

      const y = indexScale.getPixelForTick(index);
      const squareSize = 12;
      const squareX = indexScale.left - squareSize - 6;
      const squareY = y - squareSize / 2;
      console.log('Drawing square for index', index, 'at', squareX, squareY);

      ctx.save();
      ctx.fillStyle = typeof backgroundColor === 'string' ? backgroundColor : backgroundColor[0];
      ctx.fillRect(squareX, squareY, squareSize, squareSize);
      ctx.strokeStyle = '#C0C0C0';
      ctx.lineWidth = 1;
      ctx.strokeRect(squareX, squareY, squareSize, squareSize);
      ctx.restore();
    });
  },
};
