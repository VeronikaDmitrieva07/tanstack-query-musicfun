import {useMutation, useQueryClient} from "@tanstack/react-query"
import {client} from "../../../../shared/api/client"
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
            // queryClient.invalidateQueries({
            //  queryKey: ["playlists"],
            //     refetchType: "all",
            // })
            queryClient.setQueriesData({
                    queryKey: ["playlists"]
                },
                (oldData: SchemaGetPlaylistsOutput) => {
                    return {
                        ...oldData,
                        data: oldData.data.filter(p => p.id !== playlistId)
                    }
                }
            )
        }
    })

}
