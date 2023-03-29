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
		// For any CopyNativeEl, we need to delete:
		// (1) the reference in parent's children array
		// (2) itself in the copies context
		// all its children and the children's (1), (2)
		
		// For any CopyCustomComp, we need to delete:
		// (1) the reference in parent's children array
		// (2) itself in the copies context
		// (3) the reference in its pointer's copies array
		// all its children and the children's (1), (2), (3)

		const deleteCompInCopies = (compToDelete: CopyNativeEl | CopyCustomComp) => {
			const compToDeleteParent: Parent = compToDelete.parent;
			// delete child from compToDelete's parent's children array
			if (compToDeleteParent.origin === 'original') {
				const origParent = copyOriginals[compToDeleteParent.key] as OrigCustomComp;
				const parentChildren: string[] = origParent.children;
				const parentChildIdx = parentChildren.indexOf(compToDelete.name);
				parentChildren.splice(parentChildIdx, 1);
			} else if (compToDeleteParent.origin === 'copies') {
				const parentChildToDelete = copyCopies[compToDeleteParent.key] as CopyNativeEl;
				const parentChildren: string[] = parentChildToDelete.children;
				const parentChildIdx = parentChildren.indexOf(compToDelete.name);
				parentChildren.splice(parentChildIdx, 1);
			}

			// find the children of compToDelete
			const originalElement = copyOriginals[compToDelete.pointer] as OrigCustomComp;
			const compToDeleteChildren = isCopyCustomComp(compToDelete) ? originalElement.children : compToDelete.children;
			
			// if compToDelete has no children, delete its instance from the copies context
			if (compToDeleteChildren.length === 0) {
				delete copyCopies[compToDelete.name];
				return;
			}
			
			// make copy of children array since splicing elements from it while looping over it causes errors 
			const copyOfCompToDeleteChildren = [...compToDeleteChildren];
			for (const child of copyOfCompToDeleteChildren) {
				// if the child of compToDelete is a CopyCustomComp
				if (isCopyCustomComp(copyCopies[child])) {
					// delete the copy reference of the child in the parent's children array (from originals context)
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

					// child will be a copy of OrigCustomComp, meaning that child appears in the copies array of its pointer
					// delete the copy reference of the child in the original's copies array (from originals context)
					const originalElement = copyOriginals[copyCopies[child].pointer] as OrigCustomComp;
					const allCopiesInOriginals = originalElement.copies;
					allCopiesInOriginals.splice(allCopiesInOriginals.indexOf(copyCopies[child].name), 1);

					// delete the child copy object from the copies context
					delete copyCopies[child];
				} 
				// else if child is NOT a CopyCustomComp and the child has not yet been deleted from copies context
				else if (copyCopies[child]) { 
					// recursively delete the child in copies context and all of its children and copies
					deleteCompInCopies(copyCopies[child]);
				}
			}

			// delete the copy from the original's copies array (in originals context) if it is a copy of a custom component
			if (isCopyCustomComp(compToDelete)) {
				const copyInOriginals = copyOriginals[compToDelete.pointer] as OrigCustomComp;
				const copyCompToDelete: string[] = copyInOriginals.copies;
				const copyCompToDeleteIdx = copyCompToDelete.indexOf(compToDelete.name);
				copyCompToDelete.splice(copyCompToDeleteIdx, 1);
			}
			// delete compToDelete in copies context
			delete copyCopies[compToDelete.name];
		}
		
		deleteCompInCopies(compToDelete);
	}

	// TODO: Add a modal that asks the user if they are sure they want to delete the component
	// TODO: import type of event object
	// type for event React.MouseEvent<HTMLElement> but hasn't been working, so using any for now
	const handleDeleteClick = (event: any): void => {
		// prevent the click from propagating to the parent div
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();
		
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

		// if the original element has no copies, delete the children of the original element
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
						:
						<div>
							Delete
						</div>
					}
				</Modal>
				
				) : (
				<></>
            )}
		</>

	);
};

export default ComponentListItem;