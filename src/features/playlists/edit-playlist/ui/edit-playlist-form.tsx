import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {useEffect} from "react"
import {useForm} from "react-hook-form"
import {client} from "../../../../shared/api/client"
import type {SchemaGetPlaylistsOutput, SchemaUpdatePlaylistData} from "../../../../shared/api/schema"
import {useMeQuery} from "../../../auth/api/use-me-query"

type Props = {
    playlistId: string | null
}

export const EditPlaylistForm = ({playlistId}: Props) => {
    const {register, handleSubmit, reset} = useForm<SchemaUpdatePlaylistData>()

    const {data: meData} = useMeQuery()

    useEffect(() => {
        reset()
    }, [playlistId])

    const {data, isPending, isError} = useQuery({
        queryKey: ["playlists", "details", playlistId],
        queryFn: async () => {
            const response = await client.GET("/playlists/{playlistId}",
                {params: {path: {playlistId: playlistId!}}})
            return response.data!
        },
        enabled: !!playlistId
    })

    const queryClient = useQueryClient()

    const key = ["playlists", "my", meData!.userId]
    const {mutate} = useMutation({
        mutationFn: async (data: SchemaUpdatePlaylistData) => {
            const response = await client.PUT("/playlists/{playlistId}", {
                params: {path: {playlistId: playlistId!}},
                body: {data}
            })
            return response.data
        },
        onMutate: async (data: SchemaUpdatePlaylistData) => {
            // eslint-disable-next-line @tanstack/query/prefer-query-options
            await queryClient.cancelQueries({queryKey: ["playlists"]})


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
        onSettled: () =>
            queryClient.invalidateQueries({
                queryKey: ["playlists"],
                refetchType: "all"
            })
    })

    const onSubmit = (data: SchemaUpdatePlaylistData) => {
        mutate({
            ...data, type: "playlists",
            attributes: {...data.attributes, tagIds: []}
        })
    }

    if (!playlistId) return <></>
    if (isPending) return <p>Loading...</p>
    if (isError) return <p>Error...</p>

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit Playlist</h2>

        <p>
            <input {...register("attributes.title")} defaultValue={data.data.attributes.title}/>
        </p>

        <p>
            <textarea {...register("attributes.description")} defaultValue={data.data.attributes.description || ""}/>
        </p>

        <p>
            <button type={"submit"}>Save</button>
        </p>

    </form>
}