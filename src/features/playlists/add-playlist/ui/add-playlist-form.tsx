import {useForm} from "react-hook-form"
import type {SchemaCreatePlaylistData} from "../../../../shared/api/schema"
import {useAddPlaylistMutation} from "../api/use-add-playlist-mutation"

export const AddPlaylistForm = () => {
    const {register, handleSubmit} = useForm<SchemaCreatePlaylistData>()

    const {mutate} = useAddPlaylistMutation()

    const onSubmit = (data: SchemaCreatePlaylistData) => {
        mutate({...data, type: "playlists"})
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Add New Playlist</h2>

        <p> <input {...register("attributes.title")}/> </p>

        <p> <textarea {...register("attributes.description")}/> </p>

        <p> <button type={"submit"}>Create</button> </p>
    </form>
}