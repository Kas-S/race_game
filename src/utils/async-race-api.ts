import {CarType, WinnerType} from './types.ts'

class AsyncRaceApi {
    api_url = 'http://127.0.0.1:3000'

    async get_resource(url: string) {
        const result = await fetch(`${this.api_url}/${url}`)
        if (!result.ok) {
            throw new Error(result.statusText)
        }
        return await result.json()
    }
    async get_cars() {
        return await this.get_resource('garage')
    }
    async get_car(id: number) {
        return await this.get_resource(`garage/${id}`)
    }
    async create_car(car: CarType) {
        await fetch(`${this.api_url}/garage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
    }
    async update_car(id: number, car: CarType) {
        await fetch(`${this.api_url}/garage/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
    }
    async delete_car(id: number) {
        await fetch(`${this.api_url}/garage/${id}`, {
            method: 'DELETE'
        })
    }
    async start_engine(id: number): Promise<{velocity: number, distance: number}> {
        const result = await fetch(`${this.api_url}/engine?id=${id}&status=started`, {method: 'PATCH'})
        if (!result.ok) {
            throw Error(result.statusText)
        }
        return await result.json()
    }
    async stop_engine(id: number) {
        const result = await fetch(`${this.api_url}/engine?id=${id}&status=stopped`, {method: 'PATCH'})
        if (!result.ok) {
            throw Error(result.statusText)
        }
        return await result.json()
    }
    async enable_drive_mode(id: number) {
        const result = await fetch(`${this.api_url}/engine?id=${id}&status=drive`, {method: 'PATCH'})
        if (result.ok) {
            return 'arrived'
        } else if (result.status === 500) {
            return 'broken'
        }
    }
    async get_winners() {
        return await this.get_resource('winners')
    }
    async get_winner(id: number) {
        return await this.get_resource(`winners/${id}`)
    }
    async create_winner(winner: WinnerType) {
        await fetch(`${this.api_url}/winners`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(winner)
        })
    }
    async update_winner(id: number, winner: WinnerType) {
        await fetch(`${this.api_url}/winners/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(winner)
        })
    }
    async delete_winner(id: number) {
        await fetch(`${this.api_url}/winners/${id}`, {method: 'DELETE'})
    }
}

export default AsyncRaceApi