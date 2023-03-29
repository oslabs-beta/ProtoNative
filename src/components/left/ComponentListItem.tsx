import React, { useContext, useState, useEffect, useCallback } from 'react';
import AppContext from '../../context/AppContext';
import { CopyCustomComp, CopyNativeEl, OrigCustomComp, AppInterface, Parent } from '../../parser/interfaces';
import { Originals, Copies } from '../../parser/interfaces';
import Modal from './Modal';
import { isCopyCustomComp } from '../../parser/parser';
// const isCopyCustomComp = (comp: CopyNativeEl | CopyCustomComp): comp is CopyCustomComp => {
//   return comp.type === 'custom';
// }

type ComponentListItemProps = {
	comp: AppInterface | OrigCustomComp;
}

const ComponentListItem = (props: ComponentListItemProps): JSX.Element => {
	const comp = props.comp;
	const OriginalCustomComponent = comp as OrigCustomComp;
	const { currentComponent, setCurrentComponent, originals, setOriginals, copies, setCopies } = useContext(AppContext);
	const [ComponentItem, setComponentItem] = useState(null);

	// Modal states
	const [currentModal, setCurrentModal] = useState('state');
	const [isOpen, setIsOpen] = useState(false);

	// set State for components this needs to go on the originals
	//  and on copies?
	const [newState, setNewState] = useState('');
	// the input state will go on originals[name].state
	// 
	

	const handleClick = () => {
		setIsOpen(false);
		console.log('close button clicked');
	}
	
	useEffect(() => {
		comp.type === 'App'
			? setComponentItem(
					<div className={currentComponent === comp.type ? 'highlightedComponentListItem' : 'componentListItem'}  onClick={() => setCurrentComponent(comp.type)}>
						<span> {comp.type} </span>
						<button onClick={(e) => handleStateClick(e)}>State</button>
					</div>
				)
			: setComponentItem(
				<div className={currentComponent === comp.name ? 'highlightedComponentListItem' : 'componentListItem'}  onClick={() => setCurrentComponent(comp.name)}>
					<span> {comp.name} </span>
					<button onClick={(e) => handleStateClick(e)}>State</button>
					<button onClick={(e) => handleDeleteClick(e)}>Delete</button>
				</div>
			)
	}, [currentComponent, originals, copies]);

	const trashCan = (compToDelete: CopyNativeEl | CopyCustomComp, copyCopies: Copies, copyOriginals: Originals) => {
		
		const deleteCompInCopies = (compToDelete: CopyNativeEl | CopyCustomComp) => {

			console.log('NAME', compToDelete.name);
			console.log('COMP TO DELETE', compToDelete);
			
			const compToDeleteParent: Parent = compToDelete.parent;
			// delete child from parent's children array
			if (compToDeleteParent.origin === 'original') {

				// TestComponent
				const origParent = copyOriginals[compToDeleteParent.key] as OrigCustomComp;
				console.log('ORIG PARENT', origParent);
				
				const parentChildren: string[] = origParent.children;
				const parentChildIdx = parentChildren.indexOf(compToDelete.name);
				parentChildren.splice(parentChildIdx, 1);
			} else if (compToDeleteParent.origin === 'copies') {
				const parentChildToDelete = copyCopies[compToDeleteParent.key];
				const originalParentElement = copyOriginals[parentChildToDelete.pointer] as OrigCustomComp;
				const parentChildren: string[] = isCopyCustomComp(parentChildToDelete) ? originalParentElement.children : parentChildToDelete.children;
				const parentChildIdx = parentChildren.indexOf(compToDelete.name);
				parentChildren.splice(parentChildIdx, 1);
			}

			// find the children of the component to delete
			// ['Button2', 'View1', 'View2', 'BruhComponent0']
			const originalElement = copyOriginals[compToDelete.pointer] as OrigCustomComp;
			const compToDeleteChildren = isCopyCustomComp(compToDelete) ? originalElement.children : compToDelete.children;
			
			if (compToDeleteChildren.length === 0) {
				delete copyCopies[compToDelete.name];
				return;
			}
			// [CoolComponent0]
			// View0 child is CoolComponent0
			// originals => coolcomponent copies is emptied
			console.log('COMP TO DELETE CHILDREN', compToDeleteChildren);
			const copyOfCompToDeleteChildren = [...compToDeleteChildren];
			for (const child of copyOfCompToDeleteChildren) {
				console.log('CHILD------------', child);
				
				// child = CoolComponent0
				// Delete the copy in copies array in originals
				if (isCopyCustomComp(copyCopies[child])) {
					// TestComponent => children array is in originals, the children array still has CoolComponent0
					// testcomponent1 => children array is in originals
					// delete the copy reference in the parent's children array (from originals)
					// TestComponent in Originals .children [Button0, CoolComponent0]
					if (copyCopies[child].parent.origin === 'original') {
						const parentOfCopy = copyOriginals[copyCopies[child].parent.key] as OrigCustomComp;
						const parentChildren = parentOfCopy.children;
						const parentChildIdx = parentChildren.indexOf(child);
						parentChildren.splice(parentChildIdx, 1);
					} else if (copyCopies[child].parent.origin === 'copies') {
						const parentOfCopy = copyCopies[copyCopies[child].parent.key] as CopyNativeEl;
						const parentChildren = parentOfCopy.children;
						const parentChildIdx = parentChildren.indexOf(child);
						parentChildren.splice(parentChildIdx, 1);
					}


					// delete the copy reference in the original's copies array (from copies)
					const originalElement = copyOriginals[copyCopies[child].pointer] as OrigCustomComp;
					const allCopiesInOriginals = originalElement.copies;
					allCopiesInOriginals.splice(allCopiesInOriginals.indexOf(copyCopies[child].name), 1);


					console.log('DELETED CHILD!!!!!!!!!!!!!', child);
					// delete the copy object from the copies context
					delete copyCopies[child];
				} else if (copyCopies[child]) { // Button0
					console.log('this is the child that will be deleted: ', child);
					deleteCompInCopies(copyCopies[child]);
				}
			}

			// delete the copy from the original's copies array if it is a copy of a custom component
			if (isCopyCustomComp(compToDelete)) {
				const copyInOriginals = copyOriginals[compToDelete.pointer] as OrigCustomComp;
				const copyCompToDelete: string[] = copyInOriginals.copies;
				const copyCompToDeleteIdx = copyCompToDelete.indexOf(compToDelete.name);
				copyCompToDelete.splice(copyCompToDeleteIdx, 1);
			}

			delete copyCopies[compToDelete.name];
		}
		deleteCompInCopies(compToDelete);
		console.log('ORIGINALS', copyOriginals);
		console.log('COPIES', copyCopies);
	}

	const handleDeleteClick = (event: any): void => {
		// prevent the click from propagating to the parent div
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();

		setIsOpen(true);
		setCurrentModal('delete');
	}

	// TODO: Add a modal that asks the user if they are sure they want to delete the component
	// TODO: import type of event object
	// type for event React.MouseEvent<HTMLElement> but hasn't been working, so using any for now
	const handleDeleteConfirmClick = (event: any): void => {

		// create deep copies
		const deepCopy = (collection: (Originals | Copies)): (Originals | Copies) => {
			if (typeof collection !== "object" || collection === null) return collection;
			const output: {[key: string]: any} = Array.isArray(collection) ? [] : {};
			for (const [key, value] of Object.entries(collection)) {
				output[key] = deepCopy(value);
			}
			return output;
		}

		let newCopies = deepCopy(copies) as Copies;
		let newOriginals = deepCopy(originals) as Originals;
		const OriginalCustomComponent = comp as OrigCustomComp;
		const originalElement = originals[OriginalCustomComponent.name] as OrigCustomComp;

		// if the originalelement has no copies, delete the children of the original element
		// run trashcan on all children of the original element (children are typeof CopyNativeEl | CopyCustomComp)
		if (originalElement.copies.length === 0) {
			originalElement.children.forEach((childName: string) => {
				trashCan(newCopies[childName], newCopies, newOriginals);
			});
		} else {
			originalElement.copies.forEach((copyName: string) => {
				trashCan(newCopies[copyName], newCopies, newOriginals)
			});
		}

		// delete the custom component from originals
		delete newOriginals[OriginalCustomComponent.name];

		// set copies and originals to the new copies and originals
		setCopies(newCopies);
		setOriginals(newOriginals);

		// if the deleted component is the current component, set current component to null
		if (currentComponent === OriginalCustomComponent.name) setCurrentComponent('App');
	}
	
	// TODO: Add a modal for the user to input state
	const handleStateClick = (event: any): void => {

		// prevent the click from propagating to the parent div
		event.cancelBubble = true;
		event.stopPropagation && event.stopPropagation();
		
		// TODO: Flesh out state modal
		setIsOpen(true)
		setCurrentModal('state')
		console.log('clicked state')
	}

	const handleStateSaveClick = (event: any): void => {
		console.log(`new state for ${OriginalCustomComponent.name ?? comp.type}: ${newState}`);
		// create a copy of the originals object
		// update the componant with the added state in the copies
		setOriginals((prevOriginals) => {
			const updatedOriginals = { ...prevOriginals };
			const originalElement = updatedOriginals[OriginalCustomComponent.name ?? comp.type] as OrigCustomComp | AppInterface;
			originalElement.state.push(newState);
			return updatedOriginals;
		})
		setIsOpen(false);
		setNewState('');
	}
	const handleClose = (): void => {
		
		setIsOpen(false);
	};

	return (
		<>
			{ComponentItem}
			{isOpen ? (
				 <Modal handleClick={handleClick}>
					{currentModal === 'state' ? (
						
						<div>
							<div id='stateModal'>
								<h3>Add State to {comp.type ?? OriginalCustomComponent.name}</h3>
								<label htmlFor="stateInput">New State</label>
								<input 
								  id='stateInput' 
								  value={newState} 
								  onChange={(e) => setNewState(e.target.value)}
								   />
								<button onClick={() => handleClose()}>Cancel</button>
								<button onClick={handleStateSaveClick}>Save</button>
							</div>
						</div> 
						)
						: currentModal === 'delete' ? (

							<div>
								<div id='deleteModal'></div>
						      <h3>Are you sure you want to delete {OriginalCustomComponent.name}?</h3>
									<div>This will delete all occurrences of the component everywhere</div>
									<button onClick={handleDeleteConfirmClick}>Confirm</button>
									<button onClick={() => handleClose()}>Cancel</button>	
								</div>
						) : null
					}
				</Modal>
				
				) : (
				<></>
            )}
		</>

	);
};

export default ComponentListItem;