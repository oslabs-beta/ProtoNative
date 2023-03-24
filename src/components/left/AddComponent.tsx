import React, { useState, useContext } from 'react';
import AppContext from '../../context/AppContext';


// user clicks Add CC button, modal opens
// they type in their name in camelCase : if not camelCase error? or can we convert?
// when first created, goes into originals
// then when user drags into app or wherever, then it gets copied into copies


const AddComponent = (name) => {
  const [isOpen, setIsOpen] = useState(false);
  const [componentName, setComponentName] = useState('');
  const { originals, setOriginals, setCurrentComponent } = useContext(AppContext);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (/^[a-z]+(?:[A-Z][a-z]*)*$/.test(componentName)) {
      setOriginals({ ...originals, [componentName]: { type: 'custom' } });
      setComponentName('');
      setIsOpen(false);
    } else {
      alert('Component name should be in camelCase format!');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComponentName(event.target.value);
  };
  return (
    <>
      <button onClick={() => {
        console.log('are we in OnClick?');
        setIsOpen(true)
      }
      }>Add Custom Component </button>
      {isOpen && (
        <div id="modal">
          <div id="modal-content">
            <h2>Add Custom Component</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Component Name:
                <input type="text" value={componentName} onChange={handleInputChange} />
              </label>
              <button type="submit">Add</button>
              <button onClick={() => setIsOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};


export default AddComponent;