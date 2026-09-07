import {useQuery} from "@tanstack/react-query"
import {client} from "../shared/api/client"

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