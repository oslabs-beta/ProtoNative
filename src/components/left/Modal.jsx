import React, {useState} from 'react';


const Modal = ({location = 'delete'}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (e) => {
    console.log('clicked')
    setIsOpen(!isOpen)
  }
  return (
    <div id='modal-container' style={{
      display: isOpen ? 'none' : 'flex'
    }}>
      <div id='actual-modal'>
        <div id='close-button' onClick={handleClick}>X</div>
        {location === 'delete'
        ? 
        <div>
          <p>Are you sure you want to delete this component?</p>
        </div>
        :
        <p>Edit State:</p>
        }
      </div>
    </div>
  )
}

export default Modal;