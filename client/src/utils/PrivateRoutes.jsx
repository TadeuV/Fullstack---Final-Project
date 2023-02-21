import {Outlet, Navigate} from 'react-router-dom'
import {useAuthContext} from '../hooks/useAuthContext'
 
export default function PrivateRoutes ({children, ...rest}) {

    // const {user} = useAuthContext();
    const user = JSON.parse(localStorage.getItem('user'))
    // console.log(user)
    return(
        // {user ? {user.token ? <Outlet/> :<Navigate to={"/user/login"}}:"fsafsaf"} 
        user ? <Outlet/> : <Navigate to={"/user/login"} />
    )

}