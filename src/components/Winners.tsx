import {useEffect, useState} from "react";
import {WinnerType} from "../utils/types.ts";

function Winners() {
    const [winners, setWinners] = useState<WinnerType[]>([])
    const [carNames, setCarNames] = useState<string[]>([])

    useEffect(() => {
        fetch("http://127.0.0.1:3000/winners")
            .then(res => res.json())
            .then(data => {
                    setWinners(data)
            })
    }, [])

    useEffect(() => {
        setCarNames([])
        winners.forEach(v => {
            fetch(`http://127.0.0.1:3000/garage/${v.id}`)
                .then(res => res.json())
                .then(data => {
                    setCarNames((prevState) => [...prevState, data.name])
                })
        })
    }, [winners]);

    return (
        <table style={{color: "white"}}>
            <thead>
                <tr>
                    <th>Car name</th>
                    <th>Wins</th>
                    <th>Best time</th>
                </tr>
            </thead>
            <tbody>
                {winners && winners.map((winner, i) => (
                    <tr key={winner.id + Math.random()}>
                        <td>{carNames[i]}</td>
                        <td>{winner.wins}</td>
                        <td>{winner.time}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Winners