import React from 'react';

const Modal = (props: {handleClick: any, children: any}) => {
  const { handleClick, children } = props;

  // create svg of x button and add onClick event to close modal
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
        {children}
      </div>
    </div>
  );
};

export default Modal;
