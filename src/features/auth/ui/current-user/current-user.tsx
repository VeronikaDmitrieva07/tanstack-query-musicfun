import { Link } from "@tanstack/react-router"
import {useMeQuery} from "../../api/use-me-query"

export const CurrentUser = () => {
    const query = useMeQuery()

    if(!query.data) return <span>...</span>

    return (
        // <div className={s.meInfoContainer}>
        <div>
            <Link to="/my-playlists" activeOptions={{ exact: true }}>
                {query.data!.login}
            </Link>
        </div>
    )
}