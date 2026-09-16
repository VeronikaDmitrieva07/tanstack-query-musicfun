import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {useForm} from "react-hook-form"
import {client} from "../../../../shared/api/client"
import type {SchemaUpdatePlaylistData} from "../../../../shared/api/schema"

type Props = {
    playlistId: string | null
}

export const EditPlaylistForm = ({playlistId}: Props) => {
    const {register, handleSubmit} = useForm<SchemaUpdatePlaylistData>()

    const {data, isPending, isError} = useQuery({
        queryKey: ["playlists", playlistId],
        queryFn: async () => {
            const response = await client.GET("/playlists/{playlistId}",
                {params: {path: {playlistId: playlistId!}}})
            return response.data!
        },
        enabled: !!playlistId
    })

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: async (data: SchemaUpdatePlaylistData) => {
            const response = await client.PUT("/playlists/{playlistId}", {
                params: {path: {playlistId: playlistId!}},
                body: {data}
            })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["playlists"],
            })
        }
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