import React, { useState, useContext } from 'react';
import AppContext from '../../context/AppContext';
import Modal from './Modal';
import { Originals } from '../../parser/interfaces';


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
     // this regex tests that name is PascalCase:
    // it looks for CAP Letter followed by lower case & if more words follow same pattern: CAP then lower 
    if (componentName in originals) return alert('Component name already exists!');
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

  const handleClose = () => {
    setComponentName('');
    setIsOpen(false);
  };

  return (
    <div id='addComponentContainer'>
      <button id='addComponent' onClick={() => {
        console.log('are we in OnClick?');
        setIsOpen(true)
      }}>
        Add Custom Component 
      </button>
      {isOpen && (
        <div id="modal">
          <Modal handleClick={()=> setIsOpen(false)}>
            <div id="modal-content">
              <h2>Add Custom Component</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Component Name:
                  <input type="text" value={componentName} onChange={handleInputChange} />
                </label>
                <button type="submit">Add</button>
                <button onClick={() => handleClose()}>Cancel</button>
              </form>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};


export default AddComponent;