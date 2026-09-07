import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import {createRoot} from "react-dom/client"
import "../styles/reset.css"
import "../styles/index.css"
import {routeTree} from "../routes/routeTree.gen"
import {createRouter, RouterProvider} from "@tanstack/react-router"

// Create a new router instance
const router = createRouter({routeTree})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            staleTime: 5 * 1000,
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            gcTime: 5 * 1000,
        },
    },
})

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
        <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>,
)
