import {useMutation} from "@tanstack/react-query"
import {useForm} from "react-hook-form"
import {client} from "../../../../shared/api/client"
import type {SchemaCreatePlaylistData} from "../../../../shared/api/schema"

export const AddPlaylistForm = () => {
    const {register, handleSubmit} = useForm<SchemaCreatePlaylistData>()

    const {mutate} = useMutation({
        mutationFn: async (data: SchemaCreatePlaylistData) => {
            const response = await client.POST("/playlists", {
                body: {data}
            })
            return response.data
        }
    })

    const onSubmit = (data: SchemaCreatePlaylistData) => {
        mutate({...data, type: "playlists"})
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Add New Playlist</h2>

        <p>
            <input {...register("attributes.title")}/>
        </p>

        <p>
            <textarea {...register("attributes.description")}/>
        </p>

        <p>
            <button type={"submit"}>Create</button>
        </p>

    </form>
}