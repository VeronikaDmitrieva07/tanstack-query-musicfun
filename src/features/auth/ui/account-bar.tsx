import {useMeQuery} from "../api/use-me-query"
import {CurrentUser} from "./current-user/current-user"
import { LoginButton } from "./login-button.tsx"

export const AccountBar = () => {
    const query = useMeQuery()

    if (query.isPending) return <></>

    return (
        <div>
            {!query.data && <LoginButton />}
            {query.data && <CurrentUser />}
        </div>
    )
}