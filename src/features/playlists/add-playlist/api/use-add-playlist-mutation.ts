import {useMutation, useQueryClient} from "@tanstack/react-query"
import {client} from "../../../../shared/api/client"
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory"
import type {SchemaCreatePlaylistData} from "../../../../shared/api/schema"

export const useAddPlaylistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: SchemaCreatePlaylistData) => {
            const response = await client.POST("/playlists", {
                body: {data}
            })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: playlistsKeys.lists(),
                refetchType: "all"
            })
        }
    })
}