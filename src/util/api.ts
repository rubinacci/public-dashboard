const localUri = "http://localhost:5000/api"

export class Api {
    static URI: string = process.env.NODE_ENV === "development" ? localUri : "https://statera-dashboard-staging.herokuapp.com/api"

    static get = async (endpoint: string, absolute = false) => {
        const response = await fetch(`${!absolute ? Api.URI : ""}${endpoint}`)
        return await response.json()
    }
}