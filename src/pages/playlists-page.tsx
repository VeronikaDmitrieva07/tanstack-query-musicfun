import {useQuery} from "@tanstack/react-query"
import {useEffect, useState} from "react"
import {client} from "../shared/api/client"

export const PlaylistsPage = () => {
    const [isVisible, setIsVisible] = useState(true)
    useEffect(() => {
        setInterval(() => {
            setIsVisible((prev) => !prev)
        }, 3000)
    }, [])

    return <>
            <h2>hello it-incubator!!!</h2>
            {isVisible && <Playlists />}
        </>
}

export const Playlists = () => {
    const query = useQuery({
        queryKey: ["playlists"],
        queryFn: () => client.GET("/playlists")
    })

    return (
        <div>
            <ul>
                {query.data?.data?.data.map((playlist) => (
                    <li>{playlist.attributes.title}</li>
                ))}
            </ul>
        </div>
    )
}