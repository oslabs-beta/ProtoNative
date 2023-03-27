import React from 'react';

const NavBar = (): JSX.Element => {
  return (
    <div id='navbar-container'>
      <h1>ProtoNative</h1>
      <div id='master-button-container'>
        <button className='master-button'>Clear All</button>
        <button className='master-button'>Export</button>
      </div>
    </div>
  )
}

export default NavBar;