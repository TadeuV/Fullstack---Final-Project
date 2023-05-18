import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrashCan, faBasketShopping, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import "../styles/frontpage.scss"
import { useState, useEffect } from "react"
import { grocery, collection } from '../utils/mongo.client'
import { BSON } from "realm-web";
import { useNavigate } from "react-router-dom"
import Form from "./Form"
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import GroceryHistory from './GroceryHistory'



export default function FrontPage() {
  const [groceries, setGroceries] = useState([]);
  const [groceryValue, setGroceryValue] = useState();
  const [formWindow, setFormWindow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groceryDone, setGroceryDone] = useState();
  const [editingId, setEditingId] = useState();
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem('user'))


  useEffect(() => {
    async function getGrocery() {
      const allGrocery = await grocery.functions.getAllGroceries()
      setGroceries(allGrocery)
      // real sync function watching for updates
      for await (const change of collection.watch()) {
        // targeted type operation
        if (change.operationType === 'update') {
          // console.log(change)
          setGroceries(groceries => {
            return groceries.map(item => {
              const groceryId = new BSON.ObjectID(item._id).toString()
              const updatedGroceryId = new BSON.ObjectID(change.fullDocument._id).toString()
              if (groceryId === updatedGroceryId) {
                const updatedGroceryData = change.updateDescription.updatedFields
                return { ...item, ...updatedGroceryData }
              }
              return item;
            })
          })
        } else if ((change.operationType === 'delete') || (change.operationType === 'insert')) {
          setGroceryValue(change.documentKey._id)
        }
      }
    }
    if (user) {
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
    const date = new Date();
    const dateCon = date.toLocaleString('default', { date: 'short' });
    const singleGrocery = await grocery.functions.getSingleGrocery(id)
    const historyInsert = await grocery.functions.insertHistory(singleGrocery.item, singleGrocery.type, singleGrocery.brand, singleGrocery.quantity, singleGrocery.observation, singleGrocery.stringId, dateCon)
    const deletedGrocery = await grocery.functions.deleteGrocery(id)
    setGroceryValue(deletedGrocery.deletedCount)
    let checkbox = document.getElementById("checkId")
    checkbox.uncheck
  }
  const handleLogout = () => {
    logout()
    navigate("/user/login")
  }
  const toggleModal = () => {
    setFormWindow(!formWindow);
  };
  const closeFormWindow = () => {
    setFormWindow(false)
    setIsEdit(false)
  }
  
  return (
    <div className="wrapper">
      <h1>Grocery List </h1>
      {user ? <div className="userbar">Welcome {user.username}</div> : ""}
      {/* // <div className="userbar">Welcome {user.email}</div> */}
      <div className="statsbar">
        <div className="statswrapper">
          <div className="totalitems">
            {(groceries.filter(each => (each.stringId === localUser.stringId) ? true : false).length) + (
              ((groceries.filter(each => (each.stringId === localUser.stringId) ? true : false).length) > 1) ? " items" : " item")}
          </div>
          <div className="something"></div>
        </div>
        <div className="buttonwrapper">
          <div className="addwrapper">
            <FontAwesomeIcon icon={faBasketShopping} className="add" onClick={toggleModal}></FontAwesomeIcon>
            <div>Insert </div>
          </div>
          <div className="logoutwrapper">
            <FontAwesomeIcon icon={faRightFromBracket} className="logout" onClick={handleLogout}></FontAwesomeIcon>
            <div>Logout</div>
          </div>
        </div>
      </div>
      <div className="tablecontainer">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th className="tcolumn">Type</th>
              <th className="tcolumn">Brand</th>
              <th>Quantity</th>
              <th>Observation</th>
              <th>Edit</th>

              <th>Delete</th>
              <th>Check</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(groceries).length) > 0 ? (groceries.map(each =>
            ((each.stringId === localUser.stringId) ? (
              <tr key={each._id}>
                <td>{each.item}</td>
                <td className="tcolumn">{each.type}</td>
                <td className="tcolumn">{each.brand}</td>
                <td>{each.quantity}</td>
                <td>{each.observation}</td>
                <td><FontAwesomeIcon icon={faPencil} onClick={() => {
                  toggleModal();
                  setIsEdit(true);
                  setEditingId(each._id);
                }} className="updatebutton"></FontAwesomeIcon></td>
                <td><FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(each._id)} className="deletebutton"></FontAwesomeIcon></td>
                <td><input type="checkbox" id="checkId" onClick={() => { handleCheck(each._id) }}></input></td>
              </tr>
            ) : <tr className="emptylist"></tr>))) : <tr className="emptylist"></tr>
            }
          </tbody>
        </table>
      </div>
      {formWindow && (<Form isOpen={formWindow} isEdit={isEdit} closeForm={closeFormWindow} setGroceryValue={setGroceryValue} editingId={editingId}></Form>)}
      <GroceryHistory></GroceryHistory>
    </div>
  )
}
