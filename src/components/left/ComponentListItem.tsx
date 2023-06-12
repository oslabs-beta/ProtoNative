import React, { useContext, useState, useEffect, useCallback } from 'react';
import AppContext from '../../context/AppContext';
import { OrigCustomComp, AppInterface } from '../../utils/interfaces';
import { Originals, Copies } from '../../utils/interfaces';
import Modal from './Modal';
import { trashCan } from '../../utils/trashCan';
import { deepCopy } from '../../utils/deepCopy';

type ComponentListItemProps = {
	comp: AppInterface | OrigCustomComp;
}


/**
 * @description - displays App with a state button and displays custom Components with a state button and a delete button
 * @utils - uses trashCan and DeepCopy
 * @parent - ComponentList.tsx
 * @children - Modal.tsx
 *
 */

const ComponentListItem = (props: ComponentListItemProps): JSX.Element => {
	const comp = props.comp;
	const OriginalCustomComponent = comp as OrigCustomComp;
	const { currentComponent, setCurrentComponent, originals, setOriginals, copies, setCopies } = useContext(AppContext);
	const [ComponentItem, setComponentItem] = useState(null);

	// Modal states
	const [currentModal, setCurrentModal] = useState('state');
	const [isOpen, setIsOpen] = useState(false);
	const [newState, setNewState] = useState('');
	
	// displays component and highlights it if it is the current component in ComponentDetails
	useEffect(() => {
		comp.type === 'App'
			? setComponentItem(
					<div className={currentComponent === comp.type ? 'highlightedComponentListItem' : 'componentListItem'}  onClick={() => setCurrentComponent(comp.type)}>
						<span> {comp.type} </span>
						<button className='list-state-button'onClick={(e) => handleStateClick(e)}>State</button>
					</div>
				)
			: setComponentItem(
				<div className={currentComponent === comp.name ? 'highlightedComponentListItem' : 'componentListItem'}  onClick={() => setCurrentComponent(comp.name)}>
					<span> {comp.name} </span>
					<button className='list-state-button' 
									onClick={(e) => {
										handleStateClick(e)
									}
						}>State</button>
					<button className='list-delete-button'onClick={(e) => handleDeleteClick(e)}>Delete</button>
				</div>
			)
	}, [currentComponent, originals, copies]);

	// opens the delete modal
	const handleDeleteClick = (event: React.MouseEvent<HTMLElement>): void => {
		// prevent the click from propagating to the parent div
		event.stopPropagation && event.stopPropagation();

		setIsOpen(true);
		setCurrentModal('delete');
	}

	// deletes the component and all of its children from the originals and copies objects
	const handleDeleteConfirmClick = (): void => {

		// create a copy of the originals and copies objects
		let newCopies = deepCopy(copies) as Copies;
		let newOriginals = deepCopy(originals) as Originals;

		// runs trashCan on the component and all of its children
		const OriginalCustomComponent = comp as OrigCustomComp;
		const originalElement = originals[OriginalCustomComponent.name] as OrigCustomComp;
		if (originalElement.copies.length === 0) {
			originalElement.children.forEach((childName: string) => {
				trashCan(newCopies[childName], newOriginals, newCopies);
			});
		} else {
			originalElement.copies.forEach((copyName: string) => {
				trashCan(newCopies[copyName], newOriginals, newCopies)
			});
			originalElement.children.forEach((childName: string) => {
				trashCan(newCopies[childName], newOriginals, newCopies);
			});
		}

		// deletes from the copies and originals objects
		delete newOriginals[OriginalCustomComponent.name];
		setCopies(newCopies);
		setOriginals(newOriginals);

		// if the deleted component is the current component, set current component to App
		if (currentComponent === OriginalCustomComponent.name) setCurrentComponent('App');
	}
	
	// opens the state modal
	const handleStateClick = (event: React.MouseEvent<HTMLElement>): void => {
		// prevent the click from propagating to the parent div
		event.stopPropagation && event.stopPropagation();
		
		//autofocus the input
		setTimeout(()=>document.getElementById('state-modal-input').focus(), 50)
		
		setIsOpen(true)
		setCurrentModal('state')
	}

	// closes the modal and resets state input
	const handleStateClose = () => {
		setNewState('');
		setIsOpen(false);
	}

	// adds a new state to the component
	const handleStateSaveClick = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		const reservedJSKeywords = {
			'abstract': true,
			'arguments': true,
			'await': true,
			'boolean': true,
			'break': true,
			'byte': true,
			'case': true,
			'catch': true,
			'char': true,
			'class': true,
			'const': true,
			'continue': true,
			'debugger': true,
			'default': true,
			'delete': true,
			'do': true,
			'double': true,
			'else': true,
			'enum': true,
			'eval': true,
			'export': true,
			'extends': true,
			'false': true,
			'final': true,
			'finally': true,
			'float': true,
			'for': true,
			'function': true,
			'goto': true,
			'if': true,
			'implements': true,
			'import': true,
			'in': true,
			'instanceof': true,
			'int': true,
			'interface': true,
			'let': true,
			'long': true,
			'native': true,
			'new': true,
			'null': true,
			'package': true,
			'private': true,
			'protected': true,
			'public': true,
			'return': true,
			'short': true,
			'static': true,
			'super': true,
			'switch': true,
			'synchronized': true,
			'this': true,
			'throw': true,
			'throws': true,
			'transient': true,
			'true': true,
			'try': true,
			'typeof': true,
			'var': true,
			'void': true,
			'volatile': true,
			'while': true,
			'with': true,
			'yield': true,
		}
		
		// create a copy of the originals object
		// update the componant with the added state in the copies
		setOriginals((prevOriginals) => {
			const updatedOriginals = { ...prevOriginals };
			const originalElement = updatedOriginals[OriginalCustomComponent.name ?? comp.type] as OrigCustomComp | AppInterface;
			if (originalElement.state.includes(newState)) {
				document.querySelector('.error-message').innerHTML = `"${newState}" already exists!`;
				return prevOriginals;
			} else if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(newState)) {
				document.querySelector('.error-message').innerHTML = 'State must not include symbols!';
				return prevOriginals;
			} else if (reservedJSKeywords[newState as keyof typeof reservedJSKeywords]) {
				document.querySelector('.error-message').innerHTML = 'State must not be a reserved javascript keyword!';
				return prevOriginals;
			} else  {
			  originalElement.state.push(newState);
				document.querySelector('.error-message').innerHTML = '';
			  return updatedOriginals;
			}
		})
		setNewState('');
	}

	// deletes a state from the component
	const handleDeleteState = (value: string): void => {
		setOriginals((prevOriginals) => {
			const updatedOriginals = { ...prevOriginals };
			const originalElement = updatedOriginals[OriginalCustomComponent.name ?? comp.type] as OrigCustomComp | AppInterface;
			originalElement.state = originalElement.state.filter((el) => el !== value);
			return updatedOriginals;
		})
		setNewState('');
	}


	return (
		<>
			{ComponentItem}
			{isOpen
				? (
					<Modal handleClick={handleStateClose}>
						{currentModal === 'state'
							? (
								<div id='stateModal'>
									<h3>Add/delete State from {OriginalCustomComponent.name ?? comp.type}</h3>
									<form id='state-modal-form' onSubmit={handleStateSaveClick}>
										<input 
											id='state-modal-input' 
											value={newState} 
											onChange={(e) => setNewState(e.target.value)}
											onBlur={()=>setNewState('')}
										/>
										<label htmlFor="stateInput" id='state-modal-label'>New State</label>
									</form>
									<p className='error-message'></p>
									<div className="states-container">
										{OriginalCustomComponent.state.map((stateValue, index) => (
											<div key={index} className="state-item" onClick={() => handleDeleteState(stateValue)}>
												<span className='strike'>{stateValue}</span>
											</div>
										))}
									</div>
								</div> )
							: currentModal === 'delete'
							? (
								<div id='deleteModal'>
									<h3>Are you sure you want to delete {OriginalCustomComponent.name}?</h3>
									<p>This will delete all occurrences of {OriginalCustomComponent.name} everywhere!</p>
									<div id='delete-modal-buttons'>
										<button className='list-state-button delete-confirm-button' onClick={handleDeleteConfirmClick}>Confirm</button>
										<button className='list-delete-button' onClick={() => setIsOpen(false)}>Cancel</button>	
									</div>
								</div> )
							: null
						}
					</Modal> )
				: null
			}
		</>
	);
};

export default ComponentListItem;