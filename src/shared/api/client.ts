import createClient, {type Middleware} from "openapi-fetch"
import {localStorageKeys} from "../config/localstorage-keys"
import type {paths} from "./schema"

export const baseUrl = import.meta.env.VITE_BASE_URL
export const apiKey = import.meta.env.VITE_API_KEY

// mutex
let refreshPromise: Promise<void> | null = null

const makeRefreshToken = () => {
    if (!refreshPromise) {
        refreshPromise = (async (): Promise<void> => {
            const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)

            if (!refreshToken) {
                localStorage.removeItem(localStorageKeys.refreshToken)
                localStorage.removeItem(localStorageKeys.accessToken)
                throw new Error("No refresh token")
            }

            const response = await fetch(baseUrl + "auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refreshToken: refreshToken,
                })
            })

            if (!response.ok) throw new Error("Refresh token failed")

            const data = await response.json()
            localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
            localStorage.setItem(localStorageKeys.accessToken, data.accessToken)


        })()

        refreshPromise.finally(() => {
            refreshPromise = null
        })

        return refreshPromise
    }
}

const authMiddleware: Middleware = {
    onRequest({request}) {
        const accessToken = localStorage.getItem(localStorageKeys.accessToken)
        if (accessToken) {
            request.headers.set("Authorization", "Bearer " + accessToken)
        }

        // @ts-expect-error hot fix
        request._retryRequest = request.clone()
        return request
    },
    async onResponse({request, response}) {
        if (response.ok) return response

        if (!response.ok && response.status !== 401) {
            throw new Error(`${response.url}: ${response.status} ${response.statusText}`)
        }

        try {
            await makeRefreshToken()
            // @ts-expect-error ignore it
            const originalRequest: Request = request._retryRequest
            const retryRequest = new Request(originalRequest, {headers: new Headers(originalRequest.headers)})

            retryRequest.headers.set("Authorization", "Bearer " + localStorage.getItem(localStorageKeys.accessToken))

            return fetch(retryRequest)
        } catch {
            return response
        }
    }
}

export const client = createClient<paths>({
    baseUrl: baseUrl,
    headers: {
        "api-key": apiKey,
    }
})

client.use(authMiddleware)