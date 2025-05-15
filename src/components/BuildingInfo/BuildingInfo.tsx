import { MapRef } from "@vis.gl/react-maplibre"
import { AutoComplete, Input } from "antd"
import { useMemo, useState } from "react"

interface Info {
    selectedBuilding: {[name: string]: string|number}|null,
    blockMode: boolean,
    mapRef: MapRef | null
}

export const BuildingInfo = ({selectedBuilding, blockMode, mapRef}: Info) => {
    const [suggestions, setSuggestions] = useState([])

    const onSearch = async (value: string) => {
        const res = await fetch(`https://dadata.connectgas.ru/suggestions/api/4_1/rs/suggest/address?query=${value}&count=1`)
        .then((res) => res.json())
        const data = res['suggestions'][0]['data']
        mapRef?.flyTo({center: [data['geo_lon'], data['geo_lat']], zoom: 14, duration: 2000})
    }

    const onChange = async (value: string) => {
        const res = await fetch(`https://dadata.connectgas.ru/suggestions/api/4_1/rs/suggest/address?query=${value}&count=3`)
        .then((res) => res.json())
        const data = res['suggestions']
        setSuggestions(data)
    }

    const searchOptions = useMemo(() => {
        const options: {label: string, value: string}[] = []
        suggestions.map((suggestion) => {
            options.push({label: suggestion['value'], value: suggestion['value']})
        })
        return options
    },[suggestions])
    
        const word = blockMode ? 'кварталу' : 'зданию'
        if (selectedBuilding) {
            return <div style={{textAlign: 'left', alignSelf: 'baseline', padding: '10px'}}>
                <h2>Годы постройки: {selectedBuilding.aproxdate ?? selectedBuilding.year_built}</h2>
                {Number(selectedBuilding.year_lost)<2030 ? <h2>Год сноса: {selectedBuilding.year_lost}</h2> : ''}
                <h3>
                {selectedBuilding.name ? selectedBuilding.name : selectedBuilding.type}
                </h3>
                {/* <div className={styles.imageDiv}>
                <img className={styles.image} src='https://upload.wikimedia.org/wikipedia/commons/0/0a/%D0%91%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F%2C_12%D0%90_2020.jpg'/>
                </div> */}
                {selectedBuilding.addr_house &&
                <p>
                    Адрес: {selectedBuilding.addr_stree}{', дом '}{selectedBuilding.addr_house}
                </p>
                }
                {selectedBuilding.style && 
                <p>Стиль: {selectedBuilding.style}</p>
                }
                {selectedBuilding.architect && 
                <p>Архитектор: {selectedBuilding.architect}</p>
                }
                {selectedBuilding.src && 
                <p>Источник: {selectedBuilding.src}</p>
                }
            </div>
        } else {
            return <div style={{marginTop: '30px'}}>
                    <AutoComplete
                        popupClassName="certain-category-search-dropdown"
                        popupMatchSelectWidth={500}
                        style={{ width: 320 }} 
                        options={searchOptions}
                    >
                        <Input.Search 
                        onSearch={onSearch}  onChange={(e) => onChange(e.target.value)}
                        placeholder="Введите адрес" size="large" 
                        />
                    </AutoComplete>
                <h3>...или кликните по {word} на карте</h3>
            </div>
        }

}