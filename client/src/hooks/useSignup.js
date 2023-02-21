import Axios from 'axios'
import {useState} from 'react'
import {useAuthContext} from './useAuthContext'

export const useSignup = () =>{
    const [error,setError] = useState(null)
    const [isLoading,setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    // const authAxios = Axios.create({
    //     baseURL:'http://localhost:8020',
    //     headers:{
    //         Authorization:'Bearer ${}',
    //         'Content-Type':'application/json'
    //     }

    // })

    const signup = async (email,username,password) =>{
        setIsLoading(true)
        setError(null)

        // there 2 ways of making the front and back communicate:
        // 1- install CORS and stablish a connection
        // 2- use a proxy at the json file with the backend endpoint

        Axios.defaults.baseURL='http://localhost:8020'

        Axios.post('user/signup',{email,username,password},{headers:{'Content-Type':'application/json'}}).then((response)=>{
            console.log(response)
            localStorage.setItem('user',JSON.stringify(response.data))
            // update auth context
            dispatch({type:'LOGIN',payload:response.data})
            setIsLoading(false)
        }).catch((error)=>{
            setIsLoading(false)
            setError(error.response.data.error)
        })
       
        // message, name, code, config, request

        // const response = await fetch('/user/signup',{
        //     method:'POST',
        //     headers:{'Content-Type':'application/json'},
        //     body:JSON.stringify({email,username,password})
        // })
        // const json = await response.json()

        // if (!response.ok){
        //     setIsLoading(false)
        //     setError(json.error)
        // }

        // if(response.ok){
        //     localStorage.setItem('user',JSON.stringify(json))
        //     // update auth context
        //     dispatch({type:'LOGIN',payload:json})
        //     setIsLoading(false)
        // }
        
    }
    return {signup,isLoading,error}
}