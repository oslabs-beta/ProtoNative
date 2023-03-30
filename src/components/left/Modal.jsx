import React, { useEffect, useState } from 'react';

const Modal = ({ handleClick, children }) => {
  // useEffect(() => {
  //   handleClick.on('open', ({ component, props }) => {
  //     setModal({
  //       component,
  //       props,
  //       close: value => {
  //         setModal({});
  //       },
  //     });
  //   });
  // }, []);

  return (
    <div id='modal-container'>
      <div id='actual-modal'>
        <svg
          id='close-button'
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='white'
          viewBox='0 0 16 16'
          onClick={handleClick}
        >
          <path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z' />
        </svg>
        {/* {location === 'delete'
        ? 
        <div id='modal-delete-container'>
          <p>Are you sure you want to delete this component?</p>
          <div id='modal-delete-button-container'>
            <button className='modal-delete-button'>Yes</button>
            <button className='modal-delete-button' onClick={handleClick}>No</button>
          </div>
        </div>
        : */
        /*
        <div>
           {ComponentItem}
           {
               
           } 

        </div> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
