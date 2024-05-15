import {useEffect, useRef} from "react";

function Car({color, velocity, startTime, race}: {color: string, velocity: number, startTime: number, race: boolean}) {
    const r = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const t = setInterval(() => {
            if (r.current) {
                if (race) {
                    r.current.style.marginLeft = Math.min(((Date.now() - startTime) / 50) * velocity, 90) + '%'
                }
            }
        }, 50)
        if (!race) {
            clearInterval(t)
            if (r.current)
                r.current.style.marginLeft = "0%"
        }
    }, [race])

    useEffect(() => {
        if (r.current && !race) {
            r.current.style.marginLeft = "0%"
        }
    }, [race]);
    return (
        <div style={{width: "100%"}}>
            <div style={{width: "10%", height: "40px", backgroundColor: color}} ref={r}></div>
            <br/>
        </div>
    )
}

export default Car
