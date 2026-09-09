import {Outlet} from "@tanstack/react-router"
import {LoginButton} from "../../features/auth/ui/login-button"
import {Header} from "../../shared/ui/header/header"
import s from "./root-layout.module.css"

export const RootLayout = () => (
    <>
        <Header renderAccountBar={() => <LoginButton/>}/>
        <div className={s.container}>
            <Outlet/>
        </div>

    </>
)