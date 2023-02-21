import {useState} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faXmark} from "@fortawesome/free-solid-svg-icons"
import '../styles/login.scss'
import {useLogin} from "../hooks/useLogin"
import Navbar, {} from './NavBar'


export default function Login (){

    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login,isLoading,error} = useLogin();
   

    const handleSubmit = async (e) =>{
        e.preventDefault()

        await login (email,password)


        // setEmail("");
        // setPassword("")
    }


    return(
        <>  
            <Navbar></Navbar>    
            <div className="section">
                
                <div className="accesscontainer">
                    <div className="logincontainer">
                        <form className='loginform' onSubmit={handleSubmit}>
                            <div className='logintitlebox'>
                                <div className="text">Login Form</div>
                                <label className="close"><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></label>
                            </div>
                            
                            <div className="data">
                                <label>Email</label>
                                <input type="email" required onChange={(e)=>{setEmail(e.target.value)}}></input>
                            </div>
                            <div className="data">
                                <label>Password</label>
                                <input type="password" required onChange={(e)=>{setPassword(e.target.value)}} ></input>
                            </div>
                            <div className="forgot-pass">
                                <a href="#">Forgot Password?</a>
                            </div>
                            <div className="btnwrapper">
                                <div className='inner'></div>
                                <button type="submit" disabled={isLoading}>login</button>
                                {error && <div className='error'>{error}</div>}
                            </div>
                            <div className="signup-link">
                                Not a member? <a href="/user/signup"> Signup now</a>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="skew-image">
                    <div></div>
                    <div></div>
                </div>
            </div>
        </>
    )
}