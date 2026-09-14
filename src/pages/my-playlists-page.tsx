import {Navigate} from "@tanstack/react-router";
import {useMeQuery} from "../features/auth/api/use-me-query"
import {Playlists} from "../features/playlists"

export const MyPlaylistsPage = ()=> {
const {data, isPending} = useMeQuery()

    if (isPending) {
        return <div>Loading...</div>
    }

    if (!data) {
        return  <Navigate to={"/"} replace/>
    }
    return (
        <div>
            <h2>My Playlists</h2>
            <Playlists userId={data.userId}/>
        </div>
    )
}