import {type ChangeEvent, useState} from "react"
import {DeletePlaylist} from "../../../features/playlists/delete-playlist/ui/delete-playlist"
import {Pagination} from "../../../shared/ui/pagination/pagination"
import {UsePlaylistsQuery} from "../api/use-playlists-query"

type Props = {
    userId?: string
    onPlaylistSelected?: (playlistId: string) => void
    onPlaylistDeleted?: (playlistId: string) => void
    isSearchActive?: boolean
}

export const Playlists = ({userId, onPlaylistSelected, onPlaylistDeleted, isSearchActive}: Props) => {
    const [pageNumber, setPageNumber] = useState(1)
    const [search, setSearch] = useState("")

    const query = UsePlaylistsQuery(userId, {pageNumber, search})

    const handleSelectPlaylistClick = (playlistId: string) => {
        onPlaylistSelected?.(playlistId)
    }

    const handleDeletePlaylist = (playlistId: string) => {
        onPlaylistDeleted?.(playlistId)
    }

    if (query.isPending) return <span>Loading...</span>
    if (query.isError) return <span>{JSON.stringify(query.error.message)}</span>

    return (
        <div>
            {isSearchActive &&
                <>
                    <div>
                        <input
                            value={search}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)}
                            placeholder={"search..."}
                        />
                    </div>
                    <hr/>
                </>}
            <hr/>
            <Pagination
                pagesCount={query.data?.meta.pagesCount || 1}
                currentPage={pageNumber}
                onPageNumberChange={setPageNumber}
                isFetching={query.isFetching}
            />
            <ul>
                {query.data?.data.map(playlist => (
                    <li key={playlist.id}>
                        <span onClick={() => handleSelectPlaylistClick(playlist.id)}>
                            {playlist.attributes.title}
                        </span>
                        <DeletePlaylist playlistId={playlist.id} onDeleted={handleDeletePlaylist}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}