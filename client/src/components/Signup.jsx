import {useState} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faXmark} from "@fortawesome/free-solid-svg-icons"
import {useSignup} from '../hooks/useSignup';
import '../styles/signup.scss'
import Navbar from './NavBar'


export default function Signup () {
    const [email,setEmail] = useState('')
    const [username,setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {signup,isLoading,error} = useSignup()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        
        await signup (email,username,password)

        // setEmail("");
        // setUsername("");
        // setPassword("");

    }

    return (
        <>  
            <Navbar></Navbar>
            <div className="section">
                <div className="accesscontainer">
                    <div className="signupcontainer">
                        <form className='signupform' onSubmit={handleSubmit}>
                            <div className='titlebox'>
                                <div className="text">Sign Up Form</div>
                                <label className="close"><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></label>
                            </div>
                            <div className="data">
                                <label>Email</label>
                                <input type="email" required onChange={(e)=>setEmail(e.target.value)}></input>
                            </div>
                            <div className="data">
                                <label>Username</label>
                                <input type="text" required onChange={(e)=>setUsername(e.target.value)}></input>
                            </div>
                            <div className="data">
                                <label>Password</label>
                                <input type="password" required onChange={(e)=>setPassword(e.target.value)}></input>
                            </div>
                            <div className="forgot-pass">
                                <a href="#">Forgot Password?</a>
                            </div>
                            <div className="btnwrapper">
                                <div className='inner'></div>
                                <button type="submit" disabled={isLoading}>Sign Up</button>
                                {error && <div className='error'>{error}</div>}
                            </div>
                            <div className="signup-link">
                                Already a member? <a href="/user/login">Login</a>
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

