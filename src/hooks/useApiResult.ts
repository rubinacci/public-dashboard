import { useEffect, useState } from "react"
import { Api } from "../util/api"

export const useApiResult = <T>(endpoint: string, initialData: T) => {
    const [data, setData] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>()

    useEffect(() => {
        const fetchData = async () => {
            setError(null)
            setLoading(true)
            try {
                setData(await Api.get(endpoint))
            } catch (e) {
                setError(e.toString())
            }
        }
        fetchData()
    }, [endpoint]) //eslint-disable-line react-hooks/exhaustive-deps

    return { data, loading, error }
}