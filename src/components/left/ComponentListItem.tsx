import React, { useContext, useState, useEffect, useCallback } from 'react';
import AppContext from '../../context/AppContext';
import { CopyCustomComp, CopyNativeEl, OrigCustomComp, AppInterface, OrigNativeEl } from '../../parser/interfaces';
import { Originals, Copies } from '../../parser/interfaces';
import Modal from './Modal';

const isCopyCustomComp = (comp: CopyNativeEl | CopyCustomComp): comp is CopyCustomComp => {
  return comp.type === 'custom';
}
const _ = require('lodash');

type ComponentListItemProps = {
	comp: AppInterface | OrigCustomComp;
}

const ComponentListItem = (props: ComponentListItemProps): JSX.Element => {
	const comp = props.comp;
	const { currentComponent, setCurrentComponent, originals, setOriginals, copies, setCopies } = useContext(AppContext);
	const [ComponentItem, setComponentItem] = useState(null);

	// Modal states
	const [currentModal, setCurrentModal] = useState('state');
	const [isOpen, setIsOpen] = useState(false);

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
			const compToDeleteParent = compToDelete.parent;
			// delete child from parent's children array
			if (compToDeleteParent.origin === 'original') {
				const origParent = copyOriginals[compToDeleteParent.key] as OrigCustomComp;
				const parentChildren: string[] = origParent.children;
				const parentChildIdx = parentChildren.indexOf(compToDelete.name);
				parentChildren.splice(parentChildIdx, 1);
			} else if (compToDeleteParent.origin === 'copies'){
				const parentChildToDelete = copyCopies[compToDeleteParent.key];
				const originalElement = copyOriginals[parentChildToDelete.pointer] as OrigCustomComp;
				const parentChildren: string[] = isCopyCustomComp(parentChildToDelete) ? originalElement.children : parentChildToDelete.children;
				const parentChildIdx = parentChildren.indexOf(compToDelete.name);
				parentChildren.splice(parentChildIdx, 1);
			}
			const originalElement = copyOriginals[compToDelete.pointer] as OrigCustomComp;
			const compToDeleteChildren = isCopyCustomComp(compToDelete) ? originalElement.children : compToDelete.children;

			if (compToDeleteChildren.length === 0) {
				delete copyCopies[compToDelete.name];
				return;
			}

			for (const child of compToDeleteChildren) {
				if (isCopyCustomComp(copyCopies[child])) {
					const originalElement = copyOriginals[copyCopies[child].pointer] as OrigCustomComp;
					const allCopiesInOriginals = originalElement.copies;
					allCopiesInOriginals.splice(allCopiesInOriginals.indexOf(copyCopies[child].name), 1);
				}
				if (copyCopies[child]) {
					deleteCompInCopies(copyCopies[child]);
				} 
			}
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
		
		let [newCopies, newOriginals] = [_.cloneDeep(copies), _.cloneDeep(originals)];
		const OriginalCustomComponent = comp as OrigCustomComp;
		const originalElement = originals[OriginalCustomComponent.name] as OrigCustomComp;
		originalElement.copies.forEach((copyName: string) => {
			trashCan(newCopies[copyName], newCopies, newOriginals)
		});
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

	return (
		<>
			{ComponentItem}
			{isOpen
				?
				<Modal handleClick={handleClick}>
					{currentModal === 'state'
						?
						<div>
							state
						</div>
						:
						<div>
							Delete
						</div>
					}
				</Modal>
				:
				<></>
      }
		</>

	)
}

export default ComponentListItem;