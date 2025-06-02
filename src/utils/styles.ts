import { LayerProps } from "@vis.gl/react-maplibre"
import { DataDrivenPropertyValueSpecification } from "maplibre-gl"

type TStops = [number, string][]

export const blockSelection: LayerProps = {
  id: 'blockSelection',
  type: 'fill-extrusion',
  paint: {
    'fill-extrusion-color': 'black',
    'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      9, 0,
      10, ['*',['get', 'mean_lvl'],10]
    ],
    'fill-extrusion-opacity': 0.5
  },
  
}

export const EPOQUES:TStops = [
  [1, 'gray'],
  [1781, '#e51728'],
  [1782, '#e57316'],
  [1871, '#e5a717'],
  [1922, '#e6caa0'],
  [1941, '#f3f3f3'],
  [1960, '#a1e6db'],
  [1975, '#17afe6'],
  [1992, '#1616ff'],
  [2008, '#ab17e6'],
]

export const buildingUsage: DataDrivenPropertyValueSpecification<string> = [
  'match',
  ['get', 'building_2'],
  ['detached_house'],
  'rgb(184, 255, 104)',
  ['apartments'],
  'rgb(252, 195, 50)',
  ['dormitory'],
  'rgb(255, 197, 135)',
  ['mixed'],
  'rgb(254, 127, 0)',
  ['commercial'],
  'rgb(255, 44, 44)',
  ['public'],
  'rgb(64, 210, 255)',
  ['industrial'],
  'rgb(54, 43, 123)',
  ['utility'],
  'rgb(32, 134, 117)',
  'rgb(181, 181, 181)',
]

export const buildinglvl:TStops = [
  [0, '#ffffff'],  
  [1, '#c6d9ec'],  
  [4, '#7fa8d6'],  
  [10, '#3a7bbf'], 
  [17, '#0a2e6a'] 
]

export const blockUsage: DataDrivenPropertyValueSpecification<string> = [
  'match',
  ['get', 'usage'],
  [1],
  'rgb(184, 255, 104)',
  [2],
  'rgb(252, 195, 50)',
  [3],
  'rgb(255, 197, 135)',
  [4],
  'rgb(254, 127, 0)',
  [5],
  'rgb(255, 44, 44)',
  [6],
  'rgb(64, 210, 255)',
  [7],
  'rgb(54, 43, 123)',
  [8],
  'rgb(32, 134, 117)',
  '#101010'
]

export const GSI_STOPS:TStops = [
  [0, 'rgba(54, 162, 0, 0)'],
  [0.01, 'rgba(54, 162, 0, 0.1)'],
  [0.05, 'rgba(54, 162, 0, 0.25)'],
  [0.1, 'rgba(54, 162, 0, 0.5)'],
  [0.2, 'rgba(54, 162, 0, 0.75)'],
  [0.3, 'rgb(54, 162, 0)'],
]

export const FAR_STOPS:TStops = [
  [0, 'rgba(255, 0, 174,0)'],      
  [0.05, 'rgba(255, 0, 174,0.15)'],   
  [0.25, 'rgba(255, 0, 174,0.3)'],    
  [0.5, 'rgba(255, 0, 174,0.5)'],     
  [0.75, 'rgba(255, 0, 174,0.65)'],    
  [1, 'rgba(255, 0, 174,0.8)'],       
  [2, 'rgba(255, 0, 174,1)'] 
]

export const buildingSelection: LayerProps = {
  id: 'buildingSelection',
  type: 'fill-extrusion',
  paint: {
        'fill-extrusion-color': 'black',
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          9, 0,
          10, ['*',['get', 'lvl'],5]
      ],
      'fill-extrusion-opacity': 0.5
    }
}