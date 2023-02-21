import Icon from '../assets/brocoli-scared.svg'
import '../styles/404.scss'


export default function Page404 () {
    


    return (
        <div className='background'>
            <div>
                <img className="amogus" src={Icon} >
                    
                </img>
            </div>
            <div className="txt404">
                404
            </div>
            <div className="txt">
                You are lost in the basket of nowhere
                <div>Return to your <a className='link' href="/"> Basket </a></div>
            </div>
        </div>
    )

}