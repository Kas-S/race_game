import {useState, useEffect} from "react"
import ReactPaginate from "react-paginate"
import { Lane, CreateCar } from "./index.ts"
import {CarType} from '../utils/types.ts'
import AsyncRaceApi from "../utils/async-race-api.ts";
import CarsList from '../assets/cars_list.ts'

const API = new AsyncRaceApi()





function Garage() {
    const [cars , setCars] = useState<{key: number, c: CarType}[]>([]),
          [selectedCar, setSelectedCar] = useState<{key: number, c: CarType}>({key: -1, c: {name: "", color: ""}}),
          [displayedCars, setDisplayedCars] = useState<{key: number, c: CarType}[]>([]),
          [pageCount, setPageCount] = useState<number>(0),
          [itemOffset, setItemOffset] = useState<number>(0)
    const [race, setRace] = useState<boolean>(false),
          [startTime, setStartTime] = useState<number>(0)

    const [velocity, setVelocity] = useState<number[]>([]),
          [displayedVelocity, setDisplayedVelocity] = useState<number[]>([])

    const [status, setStatus] = useState<string>("")

    const itemsPerPage = 7
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
        const endOffset = itemOffset + itemsPerPage;
        setDisplayedCars(Object.values(cars).slice(itemOffset, endOffset));
        setPageCount(Math.ceil(Object.keys(cars).length / itemsPerPage));
    }, [itemOffset, itemsPerPage, cars])

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setDisplayedVelocity(Object.values(velocity).slice(itemOffset, endOffset))
    }, [velocity, itemsPerPage, itemOffset])



    useEffect(() => {
        if (race && velocity.length == cars.length) {
            setStartTime(Date.now())
            setStatus("Racing")
            let best = 0,
                max_speed = 0
            velocity.forEach((v, i) => {
                if (v > max_speed) {
                    max_speed = v
                    best = i
                }
            })
            setTimeout(() => {
                setStatus(`Winner: ${cars[best].c.name}`)
                fetch(`http://localhost:3000/winners/${cars[best].key}`)
                    .then((res) => res.json())
                    .then(data => {
                        if (data.id) {
                            fetch(`http://localhost:3000/winners/${cars[best].key}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({wins: data.wins + 1, time: (90 / max_speed) * 10 / 1000}),
                                })
                        } else {
                            fetch(`http://localhost:3000/winners/`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({id: cars[best].key, wins: 1, time: (90 / max_speed) * 10 / 1000})
                            })
                        }
                    })
            }, (90 / max_speed) * 10)
        }
    }, [race, velocity])

    function removeCar(car_key: number) {
        const idx = cars.findIndex((v) => v.key === car_key)
        API.delete_car(car_key)
            .then(() => {
                setCars((prevState) => [...prevState.slice(0, idx), ...prevState.slice(idx+1)])
            })
        fetch(`http://localhost:3000/winners/${car_key}`, {method: "DELETE"})
    }

    const runRace = () => {
        setVelocity([])
        cars.forEach((car) => {
            fetch(`http://localhost:3000/engine?id=${car.key}&status=started`, {method: "PATCH"}).then(res => res.json()).then(data => {
                setVelocity((prevState) => [...prevState, (data.velocity / data.distance) * 500])
            })
        })
        setStatus("Starting engines")
        setRace(true)
    }

    const reset = () => {
        setRace(false)
    }

    const createCar = async (name: string, color: string) => {
        const car: CarType = {name: name, color: color}
        await fetch(`http://localhost:3000/garage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        }).then(res => {
            const f = async () => {
                const r = await res.json()
                setCars((prevState) => [...prevState, {key: r.id, c: car}])
            }
            f()
        })
    }

    function handlePageClick(event: { selected: number }) {
        const newOffset = (event.selected * itemsPerPage) % Object.keys(cars).length;
        setItemOffset(newOffset);
    }

    function GenerateCars(){
        const get_random_color = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        const new_cars: {key: number, c: CarType}[] = []
        for (let i = 0; i < 100; i++) {
            const x = Math.floor(Math.random() * Object.keys(CarsList).length)
            const car_name = Object.keys(CarsList)[x] + " " + Object.values(CarsList)[x][Math.floor(Math.random() * Object.values(CarsList)[x].length)]
            new_cars.push({
                key: -1,
                c: {name: car_name, color: get_random_color()}
            })
        }
        new_cars.forEach((car, idx: number) => {
            fetch('http://localhost:3000/garage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(car.c)
            }).then(res => {
                const f = async() => {
                    const data = await res.json()
                    new_cars[idx].key = data.id
                }
                f()
            })
        })
        setCars((prevState) => [...prevState, ...new_cars])

    }

    function updateCar() {
        if (selectedCar.key != -1) {
            const idx = cars.findIndex((v) => v.key === selectedCar.key)
            API.update_car(idx+1, selectedCar.c)
                .then(() => setCars([(cars[idx] = selectedCar), ...cars].slice(1)))
        }
        setSelectedCar({
            key: -1,
            c: {name: "", color: ""}
        })

    }

    return (
        <div className="container">
            <div className="controls">
                <div className="race-reset-buttons">
                    <button type="button" onClick={runRace}>Race</button>
                    <button type="button" onClick={reset}>Reset</button>
                </div>
                <CreateCar clickEvent={createCar}/>
                <form>
                    <input type="text" placeholder="Car name" value={selectedCar.c.name}
                           onChange={(e) => setSelectedCar({
                               key: selectedCar.key,
                               c: {
                                   name: e.target.value,
                                   color: selectedCar.c.color
                               }
                           })}
                           className="garage-input"
                    />
                    <input type="color" value={selectedCar.c.color}
                           onChange={(e) => setSelectedCar({
                                    key: selectedCar.key,
                                    c: {
                                        name: selectedCar.c.name,
                                        color: e.target.value
                                    }
                           })}
                    />
                    <button type="button" onClick={updateCar}>Update</button>
                </form>

                <button type="button" onClick={GenerateCars}>Generate</button>
            </div>
            <br/>
            <h1 style={{color: "white"}}>
                {status}
            </h1>
            <br/>
            <div className="lanes">
                {displayedCars && displayedCars.map((c, i) => (
                    <Lane velocity={displayedVelocity[i] ? displayedVelocity[i] : 0} race={race && velocity.length == cars.length} startTime={startTime} carColor={c.c.color} key={i + Math.random()}
                          carKey={c.key} selectCar={setSelectedCar} carName={c.c.name} removeCar={removeCar}/>
                ))}
            </div>


            <div className="pagination">
                <ReactPaginate breakLabel="..." nextLabel="next >" previousLabel="< prev" onPageChange={handlePageClick}
                               pageRangeDisplayed={5} pageCount={pageCount} renderOnZeroPageCount={() => null}/>
            </div>
            <br/>
        </div>
    )
}

export default Garage
