import React, {useState} from 'react';


const Modal = () => {
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
        <div id='close-button' onClick={()=>{console.log('hello')}}>X</div>
      </div>
    </div>
  )
}

export default Modal;