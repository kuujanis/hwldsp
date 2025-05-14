
interface Info {
    selectedBuilding: {[name: string]: string|number}|null,
    blockMode: boolean
}

export const BuildingInfo = ({selectedBuilding, blockMode}: Info) => {
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
            return <div style={{marginTop: '40px'}}>
                <h3>Кликниет по {word} на карте</h3>
            </div>
        }

}