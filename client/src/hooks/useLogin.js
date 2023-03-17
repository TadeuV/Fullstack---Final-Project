import Axios from 'axios'
import {useState} from 'react'
import {useAuthContext} from './useAuthContext'

export const useLogin = () =>{
    const [error,setError] = useState(null)
    const [isLoading,setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const login = async (email,password) =>{
        setIsLoading(true)
        setError(null)

        // there 2 ways of making the front and back communicate:
        // 1- install CORS and stablish a connection
        // 2- use a proxy at the json file with the backend endpoint

        Axios.defaults.baseURL='http://localhost:8020'

        Axios.post('user/login',{email,password},{headers:{'Content-Type':'application/json'}}).then((response)=>{
            // console.log(response)
            localStorage.setItem('user',JSON.stringify(response.data))
            // update auth context
            dispatch({type:'LOGIN',payload:response.data})
            setIsLoading(false)
        }).catch((error)=>{
            setIsLoading(false)
            setError(error.response.data.error)
        })
       
        
    }
    return {login,isLoading,error}
}