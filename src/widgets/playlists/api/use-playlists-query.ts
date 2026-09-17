import {keepPreviousData, useQuery} from "@tanstack/react-query"
import {client} from "../../../shared/api/client"
import {playlistsKeys} from "../../../shared/api/keys-factories/playlists-keys-factory"
import type {SchemaGetPlaylistsRequestPayload} from "../../../shared/api/schema"

export const UsePlaylistsQuery = (userId: string | undefined, filters: Partial<SchemaGetPlaylistsRequestPayload>) => {
    const key = userId ? playlistsKeys.myList() : playlistsKeys.list(filters)
    const queryParams = userId ? {userId} : filters

    const query = useQuery({
        queryKey: key,
        queryFn: async () => {
            const response = await client.GET("/playlists", {
                params: {
                    query: queryParams
                }
            })
            return response.data
        },
        placeholderData: keepPreviousData
    })
    return query
}