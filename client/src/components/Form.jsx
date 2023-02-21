import Select from "react-select"
import {app,grocery,collection } from '../utils/mongo.client'
import {useState,useEffect} from "react"
import "../styles/form.scss"
import PopUp from "./modals/PopUp"
import { BSON } from "realm-web";
import {useAuthContext} from '../hooks/useAuthContext'

export default function Form({isOpen,isEdit,closeForm,setGroceryValue,editingId}){
    const {user}=useAuthContext();
    const [trigger, setTrigger] = useState(false);

    const [inputData,setInputData] = useState({
        item:"",
        type:"",
        brand:"",
        observation:""
      })

    const [inputSelect, setInputSelect] = useState(
        {value:1,label:"1"}
      )

    const quantityArray=[
        {value:1,label:"1"},
        {value:2,label:"2"},
        {value:3,label:"3"},
        {value:4,label:"4"},
        {value:5,label:"5"},
        {value:6,label:"6"},
        {value:7,label:"7"},
        {value:8,label:"8"},
        {value:9,label:"9"},
        {value:10,label:"10"},
    ];

    const handleSubmit = async(e) =>{
        e.preventDefault()
       
        if(inputData.item===""){
            setTrigger(true)
        }else if(isEdit){
            const edit = await grocery.functions.editGrocery(editingId,inputData.item,inputData.type,inputData.brand,inputSelect.value,inputData.observation)
            setGroceryValue(edit._id)
            setTrigger(false)
            closeForm();
        }
        else{
            const create =  grocery.functions.addGrocery(inputData.item,inputData.type,inputData.brand,inputSelect.value,inputData.observation,user.stringId);
            setTrigger(false)
            closeForm();
        }
        clear();
    }


    const handleChange = (e) =>{
        e.preventDefault()

        
        const {name,value} = e.target;
        setInputData({
          ...inputData, [name]:value
        })
    }

    const handleSelect = (e) =>{
        console.log("from array:", e)
        setInputSelect(e)
    }
    
    const handleForm = (e) => {
        if (e.target.classList.contains("overlayform")) {
          closeForm();
        }
    };

    const clear =()=>{
        // setItemId(null)
        setInputData({
            item:"",
            type:"",
            brand:"",
            observation:""
        });
        setInputSelect({value:1,label:"1"})
    }

    useEffect(() => {
        if (isEdit) {
          const getSingleGrocery = async () => {
            const getGrocery = await grocery.functions.getSingleGrocery( new BSON.ObjectID(editingId))
            setInputData({
                item:getGrocery.item,
                type:getGrocery.type,
                brand:getGrocery.brand,
                observation:getGrocery.observation
              })
            setInputSelect({value:getGrocery.quantity,label:getGrocery.quantity.toString()})
            
          }
    
          getSingleGrocery();
        }
    
        //clear the fields
        return () => {
          clear();
        };
    }, [isEdit]);

    return (
        <>
            <PopUp trigger={trigger} setTrigger={setTrigger}></PopUp>
            <div className="overlayform" onClick={handleForm}>
                <form className="form-modal" onSubmit={handleSubmit}>
                    {isEdit ? <h2>Update an item</h2>:<h2>Input Form</h2>}
                    <div className="inputgroup">
                        <div className="inputcontainer">
                            <label htmlFor="item">Item:</label>
                            <input name="item" id="item" type="text" value={inputData.item} onChange={handleChange}></input>
                        </div>
                        <div className="inputcontainer">
                            <label htmlFor="type">Type/Flavor:</label>
                            <input name="type" id="type" type="text" value={inputData.type} onChange={handleChange}></input>
                        </div>
                        <div className="inputcontainer">
                            <label htmlFor="brand">Brand:</label>
                            <input name="brand" id="brand" type="text" value={inputData.brand} onChange={handleChange}></input>
                        </div>
                        <div className="inputcontainer">
                                <label htmlFor="quantity">Quantity:</label>
                                <Select options={quantityArray} className="quantity" name="quantity" id="quantity" type="number" value={inputSelect} onChange={handleSelect}></Select>
                        </div>
                        <div className="inputcontainer">
                            <label htmlFor="observation">Observation:</label>
                            <textarea name="observation" id="observation" type="text" placeholder="Type additional information" value={inputData.observation} onChange={handleChange}></textarea>
                        </div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
}