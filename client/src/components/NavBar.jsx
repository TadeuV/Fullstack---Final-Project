import Icon from '../assets/brocoli-happy.svg'
import '../styles/navbar.scss'

export default function Navbar (){

    


    return(
       <nav>
         <div className='container'>
            <img className="grocerApp" src={Icon} ></img>
            <div className="apptitle">GrocerApp</div>
         </div>
         <div className='control'></div>
       </nav>
    )
}