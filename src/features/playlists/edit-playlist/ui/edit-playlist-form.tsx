import {useEffect} from "react"
import {useForm} from "react-hook-form"
import type {SchemaUpdatePlaylistData} from "../../../../shared/api/schema"
import {usePlaylistQuery} from "../api/use-playlist-query"
import {useUpdatePlaylistMutation} from "../api/use-update-playlist-mutation"

type Props = {
    playlistId: string | null
    onCancelEditing: () => void
}

export const EditPlaylistForm = ({playlistId, onCancelEditing}: Props) => {
    const {register, handleSubmit, reset} = useForm<SchemaUpdatePlaylistData>()

    useEffect(() => {
        reset()
    }, [playlistId])

    const {data, isPending, isError} = usePlaylistQuery(playlistId)
    const {mutate} = useUpdatePlaylistMutation(playlistId, {
        onSuccess: () => {
            onCancelEditing()
        }})

    const onSubmit = (data: SchemaUpdatePlaylistData) => {
        mutate({
            ...data, type: "playlists",
            attributes: {...data.attributes, tagIds: []}
        })
    }

    const handleCancelEditingCkick = () => {
        onCancelEditing()
    }

    if (!playlistId) return <></>
    if (isPending) return <p>Loading...</p>
    if (isError) return <p>Error...</p>

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit Playlist</h2>
        <p><input {...register("attributes.title")} defaultValue={data.data.attributes.title}/></p>
        <p><textarea {...register("attributes.description")} defaultValue={data.data.attributes.description || ""}/></p>
        <p>
            <button type={"submit"}>Save</button>
            <button type={"submit"} onClick={handleCancelEditingCkick}>Cancel</button>
        </p>
    </form>
}