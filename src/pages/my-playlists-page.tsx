import {Navigate} from "@tanstack/react-router"
import {useState} from "react"
import {useMeQuery} from "../features/auth/api/use-me-query"
import {AddPlaylistForm} from "../features/playlists/add-playlist/ui/add-playlist-form"
import {EditPlaylistForm} from "../features/playlists/edit-playlist/ui/edit-playlist-form"
import {Playlists} from "../widgets/playlists/ui/playlists"

export const MyPlaylistsPage = () => {
    const {data, isPending} = useMeQuery()
    const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

    const handlePlaylistDelete = (playlistId: string) => {
        if (playlistId === editingPlaylistId) {
            setEditingPlaylistId(null)
        }
    }

    if (isPending) {
        return <div>Loading...</div>
    }

    if (!data) {
        return <Navigate to={"/"} replace/>
    }
    return (
        <div>
            <h2>My Playlists</h2>
            <hr/>
            <AddPlaylistForm/>
            <hr/>
            <Playlists userId={data.userId}
                       onPlaylistSelected={(playlistId)=>setEditingPlaylistId(playlistId)}
                       onPlaylistDeleted={handlePlaylistDelete}/>
            <hr/>
            <EditPlaylistForm  playlistId={editingPlaylistId}/>
        </div>
    )
}