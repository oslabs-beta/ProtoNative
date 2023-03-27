import React, {useEffect, useState} from 'react';


const Modal = ({isOpen, handleClick, children}) => {

  return (
    <div id='modal-container'>
      <div id='actual-modal'>
        <div id='close-button' onClick={handleClick}>X</div>
        {/* {location === 'delete'
        ? 
        <div id='modal-delete-container'>
          <p>Are you sure you want to delete this component?</p>
          <div id='modal-delete-button-container'>
            <button className='modal-delete-button'>Yes</button>
            <button className='modal-delete-button' onClick={handleClick}>No</button>
          </div>
        </div>
        :
        <div>
          <p>Edit State:</p>
        </div>

        } */}
        {children}

      </div>
    </div>
  )
}

export default Modal;