import {keepPreviousData, useQuery} from "@tanstack/react-query"
import {client} from "../shared/api/client"
import {Pagination} from "../shared/ui/pagination/pagination"
import {type ChangeEvent, useState} from "react"

export const Playlists = () => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")

    const query = useQuery({
        queryKey: ["playlists", { page, search }],
        queryFn: async() => {
          const response = await client.GET("/playlists", {
              params: {
                  query: {
                      pageNumber: page,
                      search,
                  }
              }
          })
            return response.data
        },
    placeholderData: keepPreviousData
    })

    if (query.isPending) return <span>Loading...</span>
    if (query.isError) return <span>{JSON.stringify(query.error.message)}</span>


    return (
        <div>
            <div>
                <input
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)}
                    placeholder={"search..."}
                />
            </div>
            <hr/>
            <Pagination
                pagesCount={query.data?.meta.pagesCount || 1}
                currentPage={page}
                onPageNumberChange={setPage}
                isFetching={query.isFetching}
            />
            <ul>
                {query.data?.data.map(playlist => (
                    <li key={playlist.id}>{playlist.attributes.title}</li>
                ))}
            </ul>
        </div>
    )
}