import {useState, useEffect, useRef} from "react"
import Lane from "./Lane.tsx"
import {CarType} from '../utils/types.ts'
import AsyncRaceApi from "../utils/async-race-api.ts";

const API = new AsyncRaceApi()



function Garage() {
    const [cars , setCars] = useState<{key: number, c: CarType}[]>([]),
          [selectedCar, setSelectedCar] = useState<{key: number, c: CarType}>({key: -1, c: {name: "", color: ""}}),
          [displayedCars, setDisplayedCars] = useState<{key: number, c: CarType}[]>([]),
          [pageCount, setPageCount] = useState<number>(0),
          [itemOffset, setItemOffset] = useState<number>(0),
          [positions, setPositions] = useState<number[]>( [])
    const [race, setRace] = useState<boolean>(false),
          [startTime, setStartTime] = useState<number>(0)

    const velocity = useRef<number[]>([])

    const itemsPerPage = 7

    // useEffect(() => {
    //     window.localStorage.setItem('positions', JSON.stringify(positions))
    // }, [positions])

    useEffect(() => {
        API.get_cars()
            .then(res => {
                const cars_list: {key: number, c: CarType}[] = []
                for (const car of res) {
                    cars_list.push({
                        key: car.id,
                        c: {
                            name: car.name,
                            color: car.color
                        }
                    })
                }
                setCars(cars_list)
            })
    }, [])

    useEffect(() => {
        if (cars.length > positions.length) {
            const arr: number[] = []
            for (let i = positions.length; i < cars.length; i++) {
                arr.push(0)
            }
            setPositions([...positions, ...arr])
        }
    }, [cars, positions])



    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setDisplayedCars(Object.values(cars).slice(itemOffset, endOffset));
        setPageCount(Math.ceil(Object.keys(cars).length / itemsPerPage));
    }, [itemOffset, itemsPerPage, cars])



    const removeCar = (id: number) => {}

    const runRace = () => {
        setRace(true)
        setStartTime(Date.now())
    }

    const reset = () => {
        setRace(false)
    }

    function createCar (name: string, color: string) {
        const car: CarType = {name: name, color: color}
        API.create_car(car).then((res) => {
            setCars((prevState) => [...prevState, {key: res.json().id, c: car}])
        })
    }

    return (
        <div className="container">
            <div className="controls">
                <div className="race-reset-buttons">
                    <button type="button" onClick={runRace}>Race</button>
                    <button type="button" onClick={reset}>Reset</button>
                </div>
            </div>
            <br/>
            <h1>
                {positions && positions.map((c, i) => (
                    <span key={i}>{c} </span>
                ))}
            </h1>
            <br/>

            {cars && cars.map((c, i) => (
                <Lane velocity={Math.random()} race={race} startTime={startTime} carColor={c.c.color} key={c.key} carKey={c.key} selectCar={setSelectedCar} carName={c.c.name} removeCar={removeCar}/>
            ))}
            <br/>
        </div>
    )
}

export default Garage
