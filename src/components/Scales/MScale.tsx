import './Scale.css'

export const MScale = () => {
    return (
              <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: 'auto',padding: '10px', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'row', justifySelf: 'center', height: '10px'}}>
                  <div style={{width: '45px', backgroundColor: 'rgba(47, 19, 0, 1)', border: 'solid black 1px'}} />
                  <div style={{width: '45px', backgroundColor: 'rgba(75, 30, 0, 1)', border: 'solid black 1px'}} />
                  <div style={{width: '45px', backgroundColor: 'rgba(110, 48, 0, 1)', border: 'solid black 1px'}} />
                  <div style={{width: '45px', backgroundColor: 'rgba(168, 65, 0, 1)', border: 'solid black 1px'}} />
                  <div style={{width: '45px', backgroundColor: 'rgba(205, 78, 0, 1)', border: 'solid black 1px'}} />
                  <div style={{width: '45px', backgroundColor: 'rgba(255, 94, 0, 1)', border: 'solid black 1px'}} />

                </div>
                <div className='scaleTab'>
                  <span></span>
                  <span>0</span>
                  <span>0.02</span>
                  <span>0.15</span>
                  <span>0.3</span>
                  <span>0.45</span>
                  <span>0.6</span>
                  <span>0.75</span>
                </div>
              </div>        
    )
}