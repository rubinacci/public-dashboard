import { useEffect, useState } from "react"
import { Api } from "../util/api"

export const useApiResult = <T>(endpoint: string, initialData: T, absolute = false, maxRetries = 5) => {
    const [data, setData] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>()
    const [retries, setRetries] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            setError(null)
            setLoading(true)
            try {
                setData(await Api.get(endpoint, absolute))
                setRetries(0)
            } catch (e) {
                setError(e.toString())
                if (retries < maxRetries) {
                    setRetries(retries + 1)
                    setTimeout(fetchData, 1000) // retry after 1s
                }
            }
        }
        fetchData()
    }, [endpoint]) //eslint-disable-line react-hooks/exhaustive-deps

    return { data, loading, error }
}