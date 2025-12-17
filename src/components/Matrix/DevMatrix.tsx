import './DevMatrix.css'

const grey = '#3d3d3dff'

export const DevMatrix = ({matrixCount}: {matrixCount:{[name:number]:number}}) => {
    console.log(matrixCount)

    return (
        <div className='dev_matrix_container'>
            <div className="dev_matrix_rows">
                <div className="dev_row">
                    <div className="dev_cell" style={{backgroundColor: matrixCount['6'] === 0 ? grey: '#1500ffff'}}>{(matrixCount['6']*0.0001).toFixed(0)} га</div>
                    <div className="dev_cell" style={{backgroundColor: matrixCount['7'] === 0 ? grey: '#00ffaeff'}}>{(matrixCount['7']*0.0001).toFixed(0)} га</div>
                    <div className="dev_cell" style={{backgroundColor: matrixCount['8'] === 0 ? grey: '#00d227ff'}}>{(matrixCount['8']*0.0001).toFixed(0)} га</div>
                </div>
                <div className="dev_row">
                    <div className="dev_cell" style={{backgroundColor: matrixCount['3'] === 0 ? grey: '#c800ffff'}}>{(matrixCount['3']*0.0001).toFixed(0)} га</div>
                    <div className="dev_cell" style={{backgroundColor: matrixCount['4'] === 0 ? grey: '#77614bff'}}>{(matrixCount['4']*0.0001).toFixed(0)} га</div>
                    <div className="dev_cell" style={{backgroundColor: matrixCount['5'] === 0 ? grey: '#e1ff00ff'}}>{(matrixCount['5']*0.0001).toFixed(0)} га</div>
                </div>
                <div className="dev_row">
                    <div className="dev_cell" style={{backgroundColor: matrixCount['0'] === 0 ? grey: '#ff0000ff'}}>{(matrixCount['0']*0.0001).toFixed(0)} га</div>
                    <div className="dev_cell" style={{backgroundColor: matrixCount['1'] === 0 ? grey: '#ff7300ff'}}>{(matrixCount['1']*0.0001).toFixed(0)} га</div>
                    <div className="dev_cell" style={{backgroundColor: matrixCount['2'] === 0 ? grey: '#ffb700ff'}}>{(matrixCount['2']*0.0001).toFixed(0)} га</div>
                </div>
            </div>
            <div className='dev_yAxisLine'></div>
            <div className='dev_xAxisLine'></div>
            <div className='dev_xTicks'>  
                <div><span style={{color: '#ff0000ff'}}>↧</span> MXI</div>
                <div><span style={{color: '#007e6fff'}}>~</span> MXI</div>
                <div><span style={{color: '#2bff00'}}>↥</span> MXI</div>
            </div>
            <div className='dev_yTicks'>
                <div><span style={{color: '#ff0000ff'}}>↧</span> FAR</div>
                <div><span style={{color: '#007e6fff'}}>~</span> FAR</div>
                <div>FAR <span style={{color: '#2bff00'}}>↥</span></div>
            </div>
        </div>
    )
}