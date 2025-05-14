import { useCallback, useEffect, useMemo, useState } from 'react'
import {Layer, LayerProps, Map, Source} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css'
import { FilterSpecification, GeoJSONFeature, MapLayerMouseEvent } from 'maplibre-gl';
import { ConfigProvider, InputNumber, Select, Slider, Switch } from 'antd';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { accumulateValues, extractObjects, indexOfMax, lvlStatDefault } from './utils/utils';
import { blockSelection, blockUsage, buildingUsage, EPOQUES, FAR_STOPS, GSI_STOPS } from './utils/styles';

const BASE_URL = 'http://localhost:5173/'
const BLOCKS_URL = BASE_URL+'src/assets/blocks.geojson'
const BUILDINGS_URL = BASE_URL+'src/assets/buildings.geojson'

interface GeoJSON {
  type: "FeatureCollection",
  name: string,
  crs: {type: string, properties: {[name: string]: string;}}
  features: GeoJSONFeature[]
}

const emptyGeoJSON:GeoJSON = {
  type: 'FeatureCollection', 
  name: '', 
  crs: { 
    "type": "name", 
    "properties": {
     "name": "urn:ogc:def:crs:OGC:1.3:CRS84" 
    }
  }, 
  features: []
}

const darkTheme = {
  token: {
    colorBgBase: '#000000',       // Black background
    colorTextBase: '#ffffff',     // White text
    colorPrimary: '#ffffff',      // White primary
    colorBorder: '#424242',       // Gray borders
    colorBorderSecondary: '#333', // Darker borders
  },
  components: {
    // --- Slider (Range) ---
    Slider: {
      trackBg: '#ffffff',         // White track (filled part)
      railBg: '#424242',          // Gray rail (background)
      handleColor: '#ffffff',      // White handle
      handleActiveColor: '#bdbdbd', // Light gray when dragging
      trackHoverBg: '#e0e0e0',    // Light gray hover
      dotBorderColor: '#424242',   // Dots on the rail
    },
    // --- Select ---
    Select: {
      optionSelectedBg: '#333',    // Dark gray selected option
      optionActiveBg: '#1e1e1e',   // Slightly lighter hover
      colorBgContainer: '#000000', // Black dropdown background
      colorText: '#ffffff',        // White text
      colorBorder: '#424242',      // Gray border
      colorPrimaryHover: '#e0e0e0',// Light gray hover
    },
    // --- Switch ---
    Switch: {
      colorPrimary: '#1e1e1e',     // White when "on"
      colorPrimaryHover: '#e0e0e0',// Light gray hover
      colorBgContainer: '#424242', // Gray when "off"
      handleBg: '#ffffff',         // White handle
    },
  },
};

const modeOptions = [
  {value: 'density', label: <span>Плотность застройки</span>},
  {value: 'year', label: <span>Возраст застройки</span>},
  {value: 'usage', label: <span>Тип застройки</span>},
]

function App() {
  const [buildings, setBuildings] = useState<GeoJSON>(emptyGeoJSON)
  const [blocks, setBlocks] = useState<GeoJSON>(emptyGeoJSON)
  const [filteredBuildings, setFilteredBuildings] = useState<GeoJSON>(emptyGeoJSON)
  const [new_blocks, setNewBlocks] = useState<GeoJSON>(emptyGeoJSON)
  // const [year, setYear] = useState<number>(2025)
  const [mode, setMode] = useState<string>('year')
  const [far, setFar] = useState<boolean>(false)
  const [blockStat, setBlockStat] = useState<{[name: string]: string|number}|null>(null)
  const [lvlStat, setLvlStat] = useState<number[]>(lvlStatDefault)
  const [blockFid, setBlockFid] = useState<number|null>(null)
  const [epoque, setEpoque] = useState<number[]>([1781,2025])
  // const [load, setLoad] = useState<boolean>(true)

  ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, BarElement, Title, Legend);

  const fetchBlocks = async () => {
    try{
        const res = await fetch(BLOCKS_URL)
        .then(res =>  res.json())
        setBlocks(res)
    } catch (error) {
      console.log(error)
    }
  }
  const fetchBuildings = async () => {
    try{
        const res = await fetch(BUILDINGS_URL)
        .then(res =>  res.json())
        setBuildings(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchBlocks()
    fetchBuildings()
  },[])

  // building filtration

  useEffect(() => {
    const filtered_buildings = buildings.features.filter((building) => 
      building.properties.year_built <= epoque[1] && 
      building.properties.year_lost > epoque[1] &&
      building.properties.year_built >= epoque[0]
  )
    setFilteredBuildings({
      type: 'FeatureCollection', 
      name: 'buildings', 
      crs: { 
        "type": "name", 
        "properties": {
         "name": "urn:ogc:def:crs:OGC:1.3:CRS84" 
        }
      }, 
      features: filtered_buildings
    })
    
  },[epoque,buildings])

  const blockLayer = useMemo(() => {
    const blockLayerStyle: LayerProps = {
      id: 'blocks',
      type: 'fill-extrusion',
      maxzoom: 12
    }
    if (mode==='density') {
      blockLayerStyle.paint = {
        'fill-extrusion-color': {
          property: far ? 'far' : 'gsi',
          type: 'interval',
          stops: far ? FAR_STOPS : GSI_STOPS
        }
      }
    }
    if (mode==='year') {
      blockLayerStyle.paint = {
        'fill-extrusion-color': [
          'match',
          ['get','epoque'],
          [1], '#e57316',
          [2], '#e5a717',
          [3], '#e6caa0',
          [4], '#f3f3f3',
          [5], '#a1e6db',
          [6], '#17afe6',
          [7], '#1616ff',
          [8], '#ab17e6',
          'rgba(0,0,0,0)'
        ],
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          9, 0,
          10, ['*',['get', 'mean_lvl'],5]
      ]
      }
    }
    if (mode==='usage') {
      blockLayerStyle.paint = {
        'fill-extrusion-color': blockUsage,
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          9, 0,
          10, ['*',['get', 'mean_lvl'],5]
      ]
      }
    }
    return blockLayerStyle
  },[mode, far])

  const buildingLayer = useMemo(() => {
    const buildingLayerStyle: LayerProps = {
      id: 'buildings',
      type: 'fill-extrusion',
      minzoom: 12
    }
    if (mode==='year') {
      buildingLayerStyle.paint = {
        'fill-extrusion-color': {
          property: 'year_built',
          type: 'interval',
          stops: EPOQUES
        },
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          9, 0,
          10, ['*',['get', 'lvl'],5]
      ]
      }
    }
    if (mode==='usage') {
      buildingLayerStyle.paint = {
        'fill-extrusion-color': buildingUsage,
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          9, 0,
          10, ['*',['get', 'lvl'],5]
        ]
      }
    } 
    if (mode==='density') {
      buildingLayerStyle.paint = {
        'fill-extrusion-color': ['rgba', ['*',['get','lvl'], 9], 0, 0, ['-',1,['/',['get','lvl'], 100]]],
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          9, 0,
          10, ['*',['get', 'lvl'],5]
        ]
      }
    }
    return buildingLayerStyle
  },[mode])

  const onClick = useCallback((e:MapLayerMouseEvent) => {
    if (e.features && e.features.length > 0) {
      setBlockStat({...e.features[0].properties})
      setBlockFid(e.features[0].properties.fid)
    } else {
      //drop block
      setBlockFid(null)
    }
  },[])

  const blockSelectionFIlter: FilterSpecification = useMemo(() => ['in','fid', blockFid ? blockFid : ''],[blockFid])

  //block config 

  useEffect(() => {
    const upd_features = blocks?.features.map((block) => {
      if (mode==='year') {
        block.properties.merchant = 0
        block.properties.industrial = 0
        block.properties.revolutionary = 0
        block.properties.postwar = 0
        block.properties.urban = 0
        block.properties.stagnation = 0
        block.properties.nineties = 0
        block.properties.contemporary = 0
        filteredBuildings?.features.map((building) => {
          if (building.properties.block_fid === block.properties.fid) {
            if (building.properties.year_built <= 1871) {
              block.properties.merchant += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.year_built > 1871 && building.properties.year_built <= 1921) {
              block.properties.industrial += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.year_built > 1921 && building.properties.year_built <= 1941) {
              block.properties.revolutionary += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.year_built > 1941 && building.properties.year_built <= 1959) {
              block.properties.postwar += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.year_built > 1959 && building.properties.year_built <= 1974) {
              block.properties.urban += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.year_built > 1974 && building.properties.year_built <= 1991) {
              block.properties.stagnation += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.year_built > 1991 && building.properties.year_built <= 2007) {
              block.properties.nineties += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.year_built > 2007 && building.properties.year_built <= 2025) {
              block.properties.contemporary += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
          }
        })
        if (blockFid && blockFid === block.properties.fid) {
          console.log('reset')
          setBlockStat({...block.properties})
        }
        const epoqueArray = [
          block.properties.merchant, 
          block.properties.industrial, 
          block.properties.revolutionary,
          block.properties.postwar,
          block.properties.urban,
          block.properties.stagnation,
          block.properties.nineties,
          block.properties.contemporary
        ]
        const i = indexOfMax(epoqueArray)
        block.properties.epoque = i+1
        if (epoqueArray[i] === 0) {
          block.properties.epoque = 0
        }
      }
      if (mode==='usage') {
        block.properties.single = 0
        block.properties.multiple = 0
        block.properties.dormi = 0
        block.properties.mixed = 0
        block.properties.commercial = 0
        block.properties.public = 0
        block.properties.tech = 0
        block.properties.utility = 0
        filteredBuildings?.features.map((building) => {
          if (building.properties.block_fid === block.properties.fid) {
            if (building.properties.building_2 === 'detached_house') {
              block.properties.single += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.building_2 === 'apartments') {
              block.properties.multiple += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.building_2 === 'dormitory') {
              block.properties.dormi += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.building_2 === 'mixed') {
              block.properties.mixed += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.building_2 === 'commercial') {
              block.properties.commercial += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.building_2 === 'public') {
              block.properties.public += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.building_2 === 'industrial') {
              block.properties.tech += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.building_2 === 'utility') {
              block.properties.utility += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
          }
        })
        if (blockFid && blockFid === block.properties.fid) {
          console.log('reset')
          setBlockStat({...block.properties})
        }
        const usageArray = [
          block.properties.single, 
          block.properties.multiple, 
          block.properties.dormi,
          block.properties.mixed,
          block.properties.commercial,
          block.properties.public,
          block.properties.tech,
          block.properties.utility
        ]
        const i = indexOfMax(usageArray)
        block.properties.usage = i+1
        if (usageArray[i] === 0) {
          block.properties.usage = 0
        }
      }
      if (mode==='density') {
        let acc = 0 
        block.properties.low = 0
        block.properties.mid = 0
        block.properties.high = 0
        block.properties.sky = 0  
        filteredBuildings?.features.map((building) => {
          if (building.properties.block_fid === block.properties.fid) {
            acc += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
          }
          if (building.properties.block_fid === block.properties.fid) {
            if (building.properties.lvl >= 1 && building.properties.lvl < 5) {
              block.properties.low += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.lvl >= 5 && building.properties.lvl < 10) {
              block.properties.mid += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.lvl >= 10 && building.properties.lvl < 17) {
              block.properties.high += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
            if (building.properties.lvl >= 17) {
              block.properties.sky += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
          }
        })
        if (blockFid && blockFid === block.properties.fid) {
          setBlockStat({...block.properties})
        }
        if (far) {
          block.properties.far = acc*1.0/block.properties.sqr
        }
        if (!far) {
          block.properties.gsi = acc*1.0/block.properties.sqr
        }
      }

      let acc_lvl = 0
      let j = 0
      filteredBuildings?.features.map((building) => {
        if (building.properties.block_fid === block.properties.fid) {
          acc_lvl += building.properties.lvl
          j++
        }
      })
      block.properties.mean_lvl = acc_lvl*1.0/j
      if (j === 0) {
        block.properties.mean_lvl = 0
      }

      return block
    })
    if (upd_features) {
      // console.log(upd_features[246].properties)
      setNewBlocks({
        type: 'FeatureCollection', 
        name: `${Date.now().toString()}`, 
        crs: { 
          "type": "name", 
          "properties": {
           "name": "urn:ogc:def:crs:OGC:1.3:CRS84" 
          }
        }, 
        features: upd_features
      })
      const properties = extractObjects(upd_features, 'properties')
      if (!blockFid) {
        setBlockStat(accumulateValues(properties))
      }
    }
  },[blocks, blockFid, filteredBuildings, mode, far])

  useEffect(() => {
    if (mode === 'density') {
      const stat = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      const newstat = stat.map((lvl, i) => {
        if (blockFid) {
          filteredBuildings.features.map((building) => {
            if (building.properties.block_fid === blockFid) {
              if (Math.round(building.properties.lvl) === i) {
                lvl += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
              }
            }
          })
        } else {
          filteredBuildings.features.map((building) => {
            if (Math.round(building.properties.lvl) === i) {
              lvl += far ? building.properties.sqr * building.properties.lvl : building.properties.sqr
            }
          })
        }

        i++  
        return lvl
      })
      setLvlStat({...newstat})
    }
  },[filteredBuildings, mode, far, blockFid])

  const data = useMemo(() => {
    console.log('memo')
    if (mode ==='year') {
      return {
        labels: [
          '1781-1871', 
          '1872-1921', 
          '1922-1941', 
          '1942-1959', 
          '1960-1975', 
          '1976-1991',
          '1992-2007',
          '2008-2025'
        ],
        datasets: [
          {
            label: 'Sqr meters',
            data: [
              blockStat?.merchant, 
              blockStat?.industrial, 
              blockStat?.revolutionary, 
              blockStat?.postwar, 
              blockStat?.urban,
              blockStat?.stagnation,
              blockStat?.nineties,
              blockStat?.contemporary 
            ],
            backgroundColor: [
              '#e57316',
              '#e5a717',
              '#e6caa0',
              '#f3f3f3',
              '#a1e6db',
              '#17afe6',
              '#1616ff',
              '#ab17e6'
            ],
            borderColor: '#000000', // Black borders
          },
        ],
      }
    }
    if (mode ==='density') {
      return {
        labels: [
          'Малоэтажная застройка', 
          'Среднеэтажная застройка', 
          'Многоэтажная застройка', 
          'Высотная застройка', 
        ],
        datasets: [
          {
            label: 'Sqr meters',
            data: [
              blockStat?.low, 
              blockStat?.mid, 
              blockStat?.high, 
              blockStat?.sky,
            ],
            backgroundColor: [
              '#80fc03',
              '#fcba03',
              '#fc0303',
              '#a503fc',
            ],
            borderColor: '#000000', // Black borders
          },
        ],
      }
    }
    if (mode==='usage') {
      return {
        labels: [
          'Одноквартирные здания', 
          'Многоквартирные здания', 
          'Общежития', 
          'Многофункциональные здания', 
          'Офисные и торговые здания', 
          'Общественные здания',
          'Производственные здания',
          'Хозяйственные здания'
        ],
        datasets: [
          {
            label: 'Sqr meters',
            data: [
              blockStat?.single, 
              blockStat?.multiple, 
              blockStat?.dormi, 
              blockStat?.mixed, 
              blockStat?.commercial,
              blockStat?.public,
              blockStat?.tech,
              blockStat?.utility 
            ],
            backgroundColor: [
              'rgb(184, 255, 104)',
              'rgb(252, 195, 50)',
              'rgb(255, 197, 135)',
              'rgb(255, 150, 46)',
              'rgb(255, 44, 44)',
              'rgb(64, 210, 255)',
              'rgb(54, 43, 123)',
              'rgb(32, 134, 117)',
            ],
            borderColor: '#000000', // Black borders
          },
        ],
      }
    }

  },[blockStat, mode])

  useEffect(() => {
    console.log(blockStat)
    console.log(data)
  }, [blockStat, data])

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            return `${percentage}%`;
          }
        }
      }
    }
  };
  const barOptions = {
    indexAxis: 'y', 
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label || ''}: ${context.raw}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: '#737373',
          lineWidth: 1
        },
        ticks: {
          color: '#C0C0C0'
        },
        beginAtZero: true,
      },
      y: {
        // grid: {
        //   color: '#C0C0C0',
        //   lineWidth: 1
        // },
        ticks: {
          color: '#C0C0C0'
        },
      }
    },
  };

    const lvlData = useMemo(() => {
      return {
        labels: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25'],
        datasets: [
          {
            label: 'Sqr meters',
            data: lvlStat,
            backgroundColor: [
              '#ffffff',
              '#80fc03',
              '#80fc03',
              '#80fc03',
              '#fcba03',
              '#fcba03',
              '#fcba03',
              '#fcba03',
              '#fcba03',
              '#fcba03',
              '#fc0303',
              '#fc0303',
              '#fc0303',
              '#fc0303',
              '#fc0303',
              '#fc0303',
              '#fc0303',
              '#a503fc',
              '#a503fc',
              '#a503fc',
              '#a503fc',
              '#a503fc',
              '#a503fc',
              '#a503fc',
              '#a503fc',
              '#a503fc',
              '#a503fc',
              '#a503fc',
            ],
            borderColor: '#ffffff', // Black borders
          },
        ],
      }
  }, [lvlStat])
  
    const lvlOptions = useMemo(() => {return {
      indexAxis: 'x', // Vertical bars (default)
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Площадь'
          },
          grid: {
            color: '#737373',
            lineWidth: 1
          },
        },
        x: {
          title: {
            display: true,
            text: 'Этажность'
          }
        }
      }
    }},[]);
  


  return (
    <ConfigProvider theme={darkTheme}>
    <div className='main'>
      <div style={{
        height: '8vh', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
      }}>
        <b>How Old is Podol 2.0</b>
      </div>
      <div style={{width: '100vw', height: '84vh', display: 'flex', flexDirection: 'row'}}>
        <div style={{width: '25%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#141414'}}>
          <div style={{marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Select 
                style={{width: 200}} 
                onChange={(value: string) => setMode(value)}
                value={mode} options={modeOptions} 
              />
              <Switch 
                value={far} onChange={setFar}
                style={{fontSize: '2em', marginLeft: '10px'}}
                checkedChildren={<b>FSI</b>} unCheckedChildren={<b>GSI</b>} 
              />
          </div>

            <div style={{ position: 'relative', width: '120', height: '120' }}>
              <Doughnut id='doughnut' options={doughnutOptions} data={data} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  11
                </div>
              </div>
            </div>
          {mode !== 'density' && 
            <div style={{ width: '100%', height: '400px' }}>
              <Bar id='bar' data={data} options={barOptions}/>
            </div>
          }
          {mode === 'density' && 
            <div style={{ width: '100%', height: '320px' }}>
              <Bar id='lvl' data={lvlData} options={lvlOptions}/>
            </div>
          }
        </div>
        <Map
          initialViewState={{
            longitude: 37.63,
            latitude: 55.415,
            fitBoundsOptions: {minZoom: 9},
            zoom: 11,
          }}
          style={{width: '75%', height: '100%'}}
          mapStyle="https://api.maptiler.com/maps/f40a1280-834e-43de-b7ea-919faa734af4/style.json?key=5UXjcwcX8UyLW6zNAxsl"
          interactiveLayerIds={['buildings','blocks']}
          onClick={onClick}
          attributionControl={false}
        >
          <Source type="geojson" data={filteredBuildings}>
            <Layer {...buildingLayer}/>
          </Source>
          <Source type="geojson" data={new_blocks}>
            <Layer {...blockLayer}/>
            {blockFid && <Layer {...blockSelection} filter={blockSelectionFIlter}/>}
          </Source>
        </Map>

      </div>
      <div style={{height: '8vh', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
        <InputNumber 
          style={{width: '60px'}} size="large" value={epoque[0]} 
          onChange={(value: number|null) =>  setEpoque([value ? value : 1, epoque[1]])} 
        />
        <Slider range 
          style={{width: 600}}
          styles={{tracks: {background: 'white'}}} 
          min={1781} max={2025}
          value={epoque} onChange={(value) => setEpoque(value)}
        />
        <InputNumber 
          style={{width: '60px'}} size="large" value={epoque[1]} 
          onChange={(value: number|null) =>  setEpoque([epoque[0],value ? value : 1])} 
        />
      </div>
    </div>
    </ConfigProvider>

  )
}

export default App
