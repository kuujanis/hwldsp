import './Scale.css'

export const Scale = ({far}: {far: boolean}) => {
    return (
              <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: 'auto',padding: '10px', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'row', justifySelf: 'center', height: '10px'}}>
                  <div style={{width: '45px', backgroundColor: far ? 'rgb(43, 0, 29)':'rgb(18, 54, 0)', border: 'solid black 1px'}} />
                  <div style={{width: '45px', backgroundColor: far ? 'rgb(85, 0, 58)':'rgb(27, 81, 0)', border: 'solid black 1px'}} />
                  <div style={{width: '45px', backgroundColor: far ? 'rgb(128, 0, 87)':'rgb(36, 108, 0)', border: 'solid black 1px'}} />
                  <div style={{width: '45px', backgroundColor: far ? 'rgb(170, 0, 116)':'rgb(45, 135, 0)', border: 'solid black 1px'}} />
                  <div style={{width: '45px', backgroundColor: far ? 'rgb(213, 0, 145)':'rgb(54, 162, 0)', border: 'solid black 1px'}} />
                  <div style={{width: '45px', backgroundColor: far ? 'rgb(255, 0, 174)':'rgb(108, 225, 0)', border: 'solid black 1px'}} />

                </div>
                {!far && <div className='scaleTab'>
                  <span></span>
                  <span>0</span>
                  <span>0.01</span>
                  <span>0.05</span>
                  <span>0.1</span>
                  <span>0.25</span>
                  <span>0.3</span>
                  <span>1.0</span>
                </div>}
                {far && <div className='scaleTab'>
                  <span></span>
                  <span>0</span>
                  <span>0.05</span>
                  <span>0.25</span>
                  <span>0.5</span>
                  <span>0.75</span>
                  <span>1.0</span>
                  <span>2.0</span>
                </div>}
              </div>        
    )
}