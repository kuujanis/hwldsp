import { GeoJSONFeature } from 'maplibre-gl';

export interface GeoJSON {
  type: "FeatureCollection",
  name: string,
  crs: {type: string, properties: {[name: string]: string;}}
  features: GeoJSONFeature[]
}