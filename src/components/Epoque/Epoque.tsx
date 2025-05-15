
import { Dispatch, SetStateAction } from 'react';
import styles from './Epoque.module.css'

interface IEpoque {
    color: string,
    frame: number[],
    tabid: string,
    epoque: number[],
    setEpoque: Dispatch<SetStateAction<number[]>>
    articleMode: boolean
}

export const Epoque = ({color, frame, tabid, epoque, setEpoque, articleMode}:IEpoque) => {

    const active = ((epoque[1] >= frame[0]) && (epoque[0] <= frame[1]))
    const clickHandle = () => {
        const ep = frame
        if (frame[1]<epoque[0]) {ep[1]=epoque[1]}
        if (frame[0]>epoque[1]) {ep[0] = epoque[0]}
        setEpoque(ep)
    }
    const aClickHandle = () => {
        const el = document.getElementById(tabid);
        el?.scrollIntoView({ behavior: "smooth" });
    }
    return active ? <div className={styles.level} onClick={articleMode ? aClickHandle : clickHandle} style={{width: '12.5%', backgroundColor: color}}/> 
    : <div onClick={articleMode ? aClickHandle : clickHandle} className={styles.level} style={{width: '12.5%', backgroundColor: color, opacity: '33%'}}/>

}
