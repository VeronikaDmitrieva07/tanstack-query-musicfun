import {useMutation, useQueryClient} from "@tanstack/react-query"
import {client} from "../../../../shared/api/client"
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory"
import type {SchemaGetPlaylistsOutput, SchemaUpdatePlaylistData} from "../../../../shared/api/schema"

export const useUpdatePlaylistMutation = (playlistId: string | null, {onSuccess}: {onSuccess?: () => void}) => {
    const queryClient = useQueryClient()
    const key = playlistsKeys.myList()

    return useMutation({
        mutationFn: async (data: SchemaUpdatePlaylistData) => {
            const response = await client.PUT("/playlists/{playlistId}", {
                params: {path: {playlistId: playlistId!}},
                body: {data}
            })
            return response.data
        },
        onMutate: async (data: SchemaUpdatePlaylistData) => {
            await queryClient.cancelQueries({queryKey: playlistsKeys.all})

            const previousMyPlaylists = queryClient.getQueryData(key)

            queryClient.setQueryData(key, (oldData: SchemaGetPlaylistsOutput) => {
                return {
                    ...oldData,
                    data: oldData.data.map(p => {
                        if (p.id === playlistId) return {
                            ...p,
                            attributes: {
                                ...p.attributes,
                                description: data.attributes.description,
                                title: data.attributes.title
                            }
                        }
                        else return p
                    })
                }
            })
            return {previousMyPlaylists}
        },
        onError: (_, __: SchemaUpdatePlaylistData, context) => {
            queryClient.setQueryData(
                key,
                context!.previousMyPlaylists)
        },
        onSuccess: () => {
            onSuccess?.()
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: playlistsKeys.lists(),
                refetchType: "all"
            })
            queryClient.invalidateQueries({
                queryKey: playlistsKeys.detail(playlistId || ""),
                refetchType: "all"
            })
        }
    })
}