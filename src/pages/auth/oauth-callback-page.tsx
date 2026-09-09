import {useEffect} from "react"

export const OAuthCallbackPage = () => {
    useEffect(() => {
        const url = new URL(window.location.href)
        const code = url.searchParams.get("code")

        if (code && window.opener) {
            window.opener.postMessage({code}, window.location.origin)
        }


    }, [])

    return <h2>OAuth2 Callback page</h2>
}