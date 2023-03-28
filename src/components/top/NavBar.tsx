import React from 'react';


const NavBar = (): JSX.Element => {
  return (
    <div id='navbar-container'>
      <div id='logo-container'>
        <img id='actual-logo'src='/icons/logo-no-background.png'></img>
      </div>

      <div id='master-button-container'>
        <button className='master-button'>Clear All</button>
        <button className='master-button'>Export</button>
      </div>
    </div>
  )
}

export default NavBar;