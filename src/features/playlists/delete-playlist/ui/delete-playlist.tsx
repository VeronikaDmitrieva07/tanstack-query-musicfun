import {useDeleteMutation} from "../api/use-delete-mutation"

type Props = {
    playlistId: string
    onDeleted: (playlistId: string) => void
}

export const DeletePlaylist = ({playlistId, onDeleted}: Props) => {
    const {mutate} = useDeleteMutation()

    const handleDeleteClick = () => {
        mutate(playlistId)
        onDeleted?.(playlistId)
    }

    return <button onClick={handleDeleteClick}>Delete</button>
}

