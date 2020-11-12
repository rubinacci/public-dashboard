export class Api {
    static URI: string = process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "https://statera-dashboard-staging.herokuapp.com/api"

    static get = async (endpoint: string) => {
        const response = await fetch(`${Api.URI}${endpoint}`)
        return await response.json()
    }
}