import {useMutation, useQueryClient} from "@tanstack/react-query"
import {client} from "../../../shared/api/client"

export const LoginButton = () => {
    const callbackUrl = "http://localhost:5173/oauth/callback"

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async ({code}: { code: string }) => {
            const response = await client.POST("/auth/login", {
                body: {
                    code: code,
                    redirectUri: callbackUrl,
                    rememberMe: true,
                    accessTokenTTL: "1d",
                }
            })
            if (response.error) {
                throw new Error("Error logging in")
            }
            return response.data
        },

        onSuccess: (data: { refreshToken: string; accessToken: string }) => {
            localStorage.setItem("musicfun-refresh-token", data.refreshToken)
            localStorage.setItem("musicfun-access-token", data.accessToken)
            queryClient.invalidateQueries({
                 queryKey: ["auth", "me"]
            })
        },
    })

    const handleLoginClick = () => {
        window.addEventListener("message", handleOauthMessage)

        window.open(`https://musicfun.it-incubator.app/api/1.0/auth/oauth-redirect?callbackUrl=${callbackUrl}`, "apihub-oauth2", "width=500, height=600")
    }

    const handleOauthMessage = (event: MessageEvent) => {
        window.removeEventListener("message", handleOauthMessage)

        if (event.origin !== document.location.origin) {
            console.warn('origin not match')
            return
        }

        const code = event.data.code;
        if (!code) {
            console.warn('no code in message')
            return
        }

        mutation.mutate({code})
    }

    return <button onClick={handleLoginClick}>Login with APIHUB</button>
}
