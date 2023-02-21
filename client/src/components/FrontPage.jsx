import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faPencil,faTrashCan,faBasketShopping,faRightFromBracket} from "@fortawesome/free-solid-svg-icons"
import "../styles/frontpage.scss"
import {useState,useEffect} from "react"
import {grocery,collection} from '../utils/mongo.client'
import { BSON } from "realm-web";
import {useNavigate} from "react-router-dom"
import Form from "./Form"
import {useLogout} from '../hooks/useLogout'
import {useAuthContext} from '../hooks/useAuthContext'



export default function FrontPage(){
    const [groceries, setGroceries] = useState([]);
    const [groceryValue, setGroceryValue] = useState();
    const [formWindow, setFormWindow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [groceryDone, setGroceryDone] = useState();
    const [editingId, setEditingId] = useState();
    const {logout}=useLogout();
    const {user}=useAuthContext();
    const navigate=useNavigate();

    const localUser = JSON.parse(localStorage.getItem('user'))

    useEffect(()=>{
       
        
        async function getGrocery(){
        
          const allGrocery = await grocery.functions.getAllGroceries()
          setGroceries(allGrocery)
          // console.log(allGrocery[5].stringId === localUser.stringId)
   
    
          // real sync function watching for updates
          for await (const change of collection.watch()){

            // targeted type operation
            if(change.operationType === 'update'){
              // console.log(change)
              setGroceries(groceries => {
    
                return groceries.map(item => {
                  const groceryId = new BSON.ObjectID(item._id).toString()
                  const updatedGroceryId = new BSON.ObjectID(change.fullDocument._id).toString()
                  
                  // triple equality does not work on objects
                  if(groceryId === updatedGroceryId){
                    const updatedGroceryData = change.updateDescription.updatedFields
                    return { ...item, ...updatedGroceryData}
                  }
    
                  return item;
                })
              })
            }else if((change.operationType === 'delete')||(change.operationType === 'insert')){
              setGroceryValue(change.documentKey._id)
            }
          }
        }
        if (user){
          getGrocery();
        }
       
      }, [groceryValue]);

    const handleDelete = async (id) => {
        // const idAsString = new BSON.ObjectID(id).toString()
        const deletedGrocery = await grocery.functions.deleteGrocery(id)
        // deletecount =0 something wrong happened
        // this will re-render the front-end
        setGroceryValue(deletedGrocery.deletedCount)
    }


    const handleCheck = async (id) => {
      const singleGrocery = await grocery.functions.getSingleGrocery(id)
      console.log(id)
    }

    const handleLogout = () =>{
      logout()
      navigate("/user/login")
    }

    const toggleModal = () => {
      setFormWindow(!formWindow);
    }; 
    
    const closeFormWindow= ()=>{
      setFormWindow(false)
      setIsEdit(false)
    }
    

    return(
        <>  
              <h1>Grocery List </h1>
              {user ? <div className="userbar">Welcome {user.email}</div> :""}
              {/* // <div className="userbar">Welcome {user.email}</div> */}
              <div className="statsbar">
                <div className="statswrapper">
                  <div className="totalitems">
                  {Object.keys(groceries).length >1 ?  (Object.keys(groceries).length+" items"):" item"} 
                  </div>
                  <div className="something"></div>
                </div>
                <div className="buttonwrapper">
                  <div className="addwrapper">
                    <FontAwesomeIcon icon={faBasketShopping} className="add" onClick={toggleModal}></FontAwesomeIcon>
                    <div>Insert Grocery</div>
                  </div>
                  <div className="logoutwrapper">
                    <FontAwesomeIcon icon={faRightFromBracket} className="logout" onClick={handleLogout}></FontAwesomeIcon>
                    <div>Logout</div>
                  </div>
                </div>
              </div>
              <table>
                  <thead>
                      <tr>
                          <th>Item</th>
                          <th>Type</th>
                          <th>Brand</th>
                          <th>Quantity</th>
                          <th>Observation</th>
                          <th>Edit</th>
                          <th>Delete</th>
                          <th>Check</th>
                      </tr>
                  </thead>
                  <tbody>
                      {(Object.keys(groceries).length) > 0 ? (groceries.map(each=>
                        
                      ((each.stringId === localUser.stringId) ? (
                          <tr key={each._id}>
                              <td>{each.item}</td>
                              <td>{each.type}</td>
                              <td>{each.brand}</td>
                              <td>{each.quantity}</td>
                              <td>{each.observation}</td>
                              <td><FontAwesomeIcon icon={faPencil} onClick={() => {
                                  toggleModal();
                                  setIsEdit(true);
                                  setEditingId(each._id);
                                  }} className="updatebutton"></FontAwesomeIcon></td>
                              <td><FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(each._id)} className="deletebutton"></FontAwesomeIcon></td>
                              <td><input type="checkbox" onClick={()=>{handleCheck(each._id)}}></input></td>
                          </tr>
                      ):<tr className="emptylist"></tr>))):<tr className="emptylist"></tr>
                      // (
                      //     <tr key={each._id}>
                      //         <td>{localUser.stringId +"/"+ each.stringId}</td>
                      //         <td>{each.item}</td>
                      //         <td>{each.type}</td>
                      //         <td>{each.brand}</td>
                      //         <td>{each.quantity}</td>
                      //         <td>{each.observation}</td>
                      //         <td><FontAwesomeIcon icon={faPencil} onClick={() => {
                      //             toggleModal();
                      //             setIsEdit(true);
                      //             setEditingId(each._id);
                      //             }} className="updatebutton"></FontAwesomeIcon></td>
                      //         <td><FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(each._id)} className="deletebutton"></FontAwesomeIcon></td>
                      //         <td><input type="checkbox" onClick={()=>{handleCheck(each._id)}}></input></td>
                      //     </tr>
                      // ))):<tr className="emptylist">{"The Grocery list is empty"}</tr>
                     
                      }
                  </tbody>
              </table>
              {formWindow &&(<Form isOpen={formWindow} isEdit={isEdit} closeForm={closeFormWindow} setGroceryValue={setGroceryValue} editingId={editingId}></Form>)}
        </>

    )

}


