import React, { useState,useEffect } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faXmarkCircle,faTriangleExclamation} from "@fortawesome/free-solid-svg-icons"
import "../../styles/popup.scss";

export default function Modal({trigger,setTrigger}) {
  const [modal, setModal] = useState();


  const toggleModal = () => {
    setTrigger(!trigger);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
      {/* <button onClick={toggleModal} className="btn-modal">
        Open
      </button> */}

      {trigger && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <FontAwesomeIcon icon={faTriangleExclamation} className="alert"></FontAwesomeIcon>
            <p>
              The field "Item" cannot be empty. Please provide an item name.
            </p>
            <FontAwesomeIcon icon={faXmarkCircle} className="close-modal" onClick={toggleModal}>
              
            </FontAwesomeIcon>
          </div>
        </div>
      )}
    </>
  );
}