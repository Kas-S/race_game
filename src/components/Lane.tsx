import Car from './Car.tsx'
import React from "react"
import {CarType} from '../utils/types.tsx'

interface LaneProps {
    carKey: number
    carColor: string
    carName: string
    velocity: number
    startTime: number
    race: boolean
    removeCar: (id: number) => void
    selectCar: React.Dispatch<React.SetStateAction<{key: number, c: CarType }>>
}

function Lane({carKey, carColor, carName, removeCar, selectCar, velocity, startTime, race}: LaneProps) {
    return (
        <div className="lane">
            <div className="car-control-buttons">
                <div>
                    <button type="button" className="car-select-button" onClick={() => selectCar({key: carKey, c: {name: carName, color: carColor}})}>Select</button>
                    <br/><br/>
                    <button type="button" className="car-remove-button" onClick={() => removeCar(carKey)}>Remove</button>
                </div>
                <div>
                    <button type="button" className="car-control-button">S</button>
                    <br/><br/>
                    <button type="button" className="car-control-button">R</button>
                </div>
            </div>
            <div className="track">
                <Car color={carColor} velocity={velocity} startTime={startTime} race={race}/>
                <h3 style={{color: "white"}}>{carName}</h3>
            </div>
        </div>
    )
}

export default Lane