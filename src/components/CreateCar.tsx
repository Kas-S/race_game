import { useState } from 'react'

interface Props {
    clickEvent: (name: string, color: string) => void
}

function CreateCar({ clickEvent }: Props) {
    const [name, setName] = useState<string>(''),
        [color, setColor] = useState<string>('')
    return (
        <form>
            <input type="text" placeholder="Car name" onChange={(e) => setName(e.target.value)} className="garage-input"/>
            <input type="color" onChange={(e) => setColor(e.target.value)}/>
            <button type="button" onClick={() => clickEvent(name, color)}>Create</button>
        </form>
    )
}

export default CreateCar
