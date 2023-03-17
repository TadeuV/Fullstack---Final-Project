import {useState,useEffect} from "react"
import {grocery,collection} from '../utils/mongo.client'
import {useAuthContext} from '../hooks/useAuthContext'
import '../styles/groceryhistory.scss'





export default function GroceryHistory () {
    const [groceryHistory,setGroceryHistory] = useState([])
    const [groceryValue, setGroceryValue] = useState();
    const {user}=useAuthContext();

    const localUser = JSON.parse(localStorage.getItem('user'))
   
    useEffect(()=>{
       
        async function getGroceryHistory(){
        
          const allGroceryHistory = await grocery.functions.getAllHistory()
          setGroceryHistory(allGroceryHistory)
          
    
          // real sync function watching for updates
          for await (const change of collection.watch()){

            if(change.operationType === 'delete'){
                setGroceryValue(change.documentKey._id)
              
            }
          }
        }
        if (user){
          getGroceryHistory();
        }
       
    }, [groceryValue]);
    
    const handleCheckMistake = async (id) => {
     
        const singleHistory = await grocery.functions.getSingleHistory(id)
        const groceryReturn = await grocery.functions.addGrocery(singleHistory.item,singleHistory.type,singleHistory.brand,singleHistory.quantity,singleHistory.observation,singleHistory.stringId)
        const deletedHistory = await grocery.functions.deleteHistory(id)
        setGroceryValue(deletedHistory.deletedCount)
        // let checkbox = document.getElementById("checkId")
        // checkbox.uncheck
          
      }


    return (
        <>  
        <div className="historywrapper">
            <div className="historytitle">Purchase History</div>
            <div className="historycontainer">
        
            {(Object.keys(groceryHistory).length) > 0 ? (groceryHistory.map(each=>
                        
                ((each.stringId === localUser.stringId) ? (

                <div className="grocerywrapper" key={each._id}>
                    <div className="titlebox">
                        <div className="historyitem">{each.item}</div>
                        <div className="historydate">{each.date}</div>
                    </div>
                    <div className="itemwrapper">
                        <div className="detailswrapper">
                            <div className="historytype">{each.type}</div>
                            <div className="historybrand">{each.brand}</div>
                            <div className="historyquantity">{each.quantity}</div>
                        </div>
                        <div className="historyobservation">{each.observation}</div>
                        <div className="returnwrapper">
                            <div>Uncheck</div>
                            <input className="returnbutton" type="checkbox" onClick={()=>{handleCheckMistake(each._id)}}></input>
                        </div>
                    </div>  
                </div>
                ):""))):<div className="historynotfound">No history found</div>}
            </div>
        </div>
        </>
    )
}

