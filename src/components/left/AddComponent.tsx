import React, { useState, useContext } from 'react';
import AppContext from '../../context/AppContext';
import Modal from './Modal';
import { Originals } from '../../utils/interfaces';


// user clicks Add CC button, modal opens
// they type in their name in camelCase : if not camelCase error? or can we convert?
// when first created, goes into originals
// then when user drags into app or wherever, then it gets copied into copies


const AddComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [componentName, setComponentName] = useState('');
  const { originals, setOriginals, setCurrentComponent } = useContext(AppContext);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (componentName in originals) return document.querySelector('.error-message').innerHTML = 'Component name already exists!';
    if (!/^[A-Z][a-zA-Z]*$/.test(componentName)) return document.querySelector('.error-message').innerHTML = 'Component name must be in PascalCase!';
    setOriginals((previous: Originals): Originals => {
      return {
        ...previous,
        [componentName]: {
          name: componentName,
          type: 'custom',
          children: [],
          state: [],
          index: 0,
          copies: [],
        }
      };
    });
    setComponentName('');
    setCurrentComponent(componentName);
    setIsOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComponentName(event.target.value);
  };

  return (
    <div id='addComponentContainer'>
      <button id='addComponent' onClick={() => {
        setTimeout(()=>document.getElementById('add-component-input').focus(), 50)
        
        setIsOpen(true)
      }}>
        Add Custom Component 
      </button>
      {isOpen && (
        <Modal handleClick={()=> {
          setComponentName('');
          setIsOpen(false);
        }}>
          <div id="modal-content">
            <h2>Add Custom Component</h2>
            <form onSubmit={handleSubmit} id='add-component-form'>
              <input id='add-component-input' name="name" type="text" value={componentName} onChange={handleInputChange} onBlur={()=>setComponentName('')}/>
              <label id='add-component-label'>Component Name</label>
              <div className='error-message'></div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};


export default AddComponent;