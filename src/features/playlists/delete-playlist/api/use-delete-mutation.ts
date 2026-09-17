import {useMutation, useQueryClient} from "@tanstack/react-query"
import {client} from "../../../../shared/api/client"
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory"
import type {SchemaGetPlaylistsOutput} from "../../../../shared/api/schema"

export const useDeleteMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (playlistId: string) => {
            const response = await client.DELETE("/playlists/{playlistId}", {
                params: {path: {playlistId}}
            })
            return response.data
        },
        onSuccess: (_data, playlistId) => {
            queryClient.setQueriesData({queryKey: playlistsKeys.lists()}, (oldData: SchemaGetPlaylistsOutput) => {
                return {
                    ...oldData,
                    data: oldData.data.filter(p => p.id !== playlistId)
                }
            })
            queryClient.setQueryData(playlistsKeys.detail(playlistId), () => {
                return null
            })
        }
    })

}
