
import './SpaceMatrix.css'


const grey = '#3d3d3dff'

interface MatrixProps {
    matrixCount: {[name:number]:number};
}

export const SpaceMatrix = ({matrixCount}: MatrixProps) => {
    console.log(matrixCount)

    return (
        <div className='matrix_container'>
            
            <div className="matrix_rows">
                <div className="row">
                    <div className="cell" style={{backgroundColor: matrixCount['6'] === 0 ? grey: '#00ffffff'}}>{(matrixCount['6']*0.0001).toFixed(0)} га</div>
                    <div className="cell" style={{backgroundColor: matrixCount['7'] === 0 ? grey: '#00ffaeff'}}>{(matrixCount['7']*0.0001).toFixed(0)} га</div>
                    <div className="cell" style={{backgroundColor: matrixCount['8'] === 0 ? grey: '#1eff00ff'}}>{(matrixCount['8']*0.0001).toFixed(0)} га</div>
                </div>
                <div className="row">
                    <div className="cell" style={{backgroundColor: matrixCount['3'] === 0 ? grey: '#009a6cff'}}>{(matrixCount['3']*0.0001).toFixed(0)} га</div>
                    <div className="cell" style={{backgroundColor: matrixCount['4'] === 0 ? grey: '#3bb001ff'}}>{(matrixCount['4']*0.0001).toFixed(0)} га</div>
                    <div className="cell" style={{backgroundColor: matrixCount['5'] === 0 ? grey: '#b5de00ff'}}>{(matrixCount['5']*0.0001).toFixed(0)} га</div>
                </div>
                <div className="row">
                    <div className="cell" style={{backgroundColor: matrixCount['0'] === 0 ? grey: 'rgb(0, 105, 3)'}}>{(matrixCount['0']*0.0001).toFixed(0)} га</div>
                    <div className="cell" style={{backgroundColor: matrixCount['1'] === 0 ? grey: '#8da000ff'}}>{(matrixCount['1']*0.0001).toFixed(0)} га</div>
                    <div className="cell" style={{backgroundColor: matrixCount['2'] === 0 ? grey: '#ffb700ff'}}>{(matrixCount['2']*0.0001).toFixed(0)} га</div>
                </div>
            </div>
            <div className='yAxisLine'></div>
            <div className='xAxisLine'></div>
            <div className='xTicks'>  
                <div>0</div>
                <div>3</div>
                <div>9</div>
                <div>L</div>
            </div>
            <div className='yTicks'>
                <div>0</div>
                <div>15</div>
                <div>30</div>
                <div>GSI, %</div>
            </div>
        </div>
    )
}