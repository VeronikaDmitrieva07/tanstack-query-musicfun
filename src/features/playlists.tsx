import {useQuery} from "@tanstack/react-query"
import {client} from "../shared/api/client"

export const Playlists = () => {
    const query = useQuery({
        queryKey: ["playlists"],
        queryFn: async() => {
          const response = await client.GET("/playlists" as unknown as "playlists")

            if(response.error) {
                throw (response as unknown as {error: Error}).error
            }
            return response.data
        }})

    if (query.isPending) return <span>Loading...</span>
    if (query.isError) return <span>{JSON.stringify(query.error.message)}</span>


    return (
        <div>
            {query.isFetching ? "⏳" : ""}
            <ul>
                {query.data.data.map(playlist => (
                    <li key={playlist.id}>{playlist.attributes.title}</li>
                ))}
            </ul>
        </div>
    )
}