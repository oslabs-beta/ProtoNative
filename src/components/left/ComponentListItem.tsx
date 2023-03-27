import React, { useContext, useState, useEffect, useCallback } from 'react';
import AppContext from '../../context/AppContext';
import { CopyCustomComp, CopyNativeEl, OrigCustomComp, AppInterface, OrigNativeEl } from '../../parser/interfaces';
import { Originals, Copies } from '../../parser/interfaces';
// import { isCopyCustomComp } from '../../parser/parser';

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
	
	// if the name is 'app', do not render the delete button and do not allow the user to click on the component
	// useEffect(() => {
	// 	if (comp.name === 'App') {
	// 		setComponentItem(
	// 			<div className='componentListItem'>
	// 				<span> {comp.name} </span>
	// 			</div>
	// 		)
	// 	} else {
	// 		setComponentItem(
	// 			<div className={currentComponent === comp.name ? 'highlightedComponentListItem' : 'componentListItem'} onClick={() => handleHighlight()}>
	// 				<span> {comp.name} </span>
	// 				<button onClick={(e) => handleStateClick(e)}>State</button>
	// 				<button onClick={(e) => handleDeleteClick(e)}>Delete</button>
	// 			</div>
	// 		)
	// 	}
	// }, [currentComponent, originals, copies]);

	useEffect(() => {
		if (comp.type === 'App') {
			currentComponent === comp.type
				? setComponentItem(
					<div className='highlightedComponentListItem'>
						<span> {comp.type} </span>
					</div>
				)
				: setComponentItem(
					<div className='componentListItem' onClick={() => setCurrentComponent(comp.type)}>
						<span> {comp.type} </span>
					</div>
				)
		} else {
			currentComponent === comp.name
				? setComponentItem(
					<div className='highlightedComponentListItem'>
						<span> {comp.name} </span>
						<button onClick={(e) => handleStateClick(e)}>State</button>
						<button onClick={(e) => handleDeleteClick(e)}>Delete</button>
					</div>
				)
				: setComponentItem(
					<div className='componentListItem' onClick={() => setCurrentComponent(comp.name)}>
						<span> {comp.name} </span>
						<button onClick={(e) => handleStateClick(e)}>State</button>
						<button onClick={(e) => handleDeleteClick(e)}>Delete</button>
					</div>
				)
		}
	}, [currentComponent, originals, copies]);

	// TODO: Add a modal for the user to input state
	const handleStateClick = (event: any): void => {
		event.cancelBubble = true;
		if(event.stopPropagation) event.stopPropagation();
	}

	const trashCan = (compToDelete: CopyNativeEl | CopyCustomComp, copyCopies: Copies, copyOriginals: Originals) => {
		

		const deleteCompInCopies = (compToDelete: CopyNativeEl | CopyCustomComp) => {
			// console.log('isCopyCustomComp', isCopyCustomComp(compToDelete));
			
			// use the pointer property to find parent
			// delete the reference to the copyCustomComp (copies context) from the copies array in the original obj
			
			const compToDeleteParent = compToDelete.parent;
			// delete child from parent's children array
			if (compToDeleteParent.origin === 'original') {
				const parentChildren: string[] = copyOriginals[compToDeleteParent.key].children;
				const parentChildIdx = parentChildren.indexOf(compToDelete.name);
				parentChildren.splice(parentChildIdx, 1);
			} else if (compToDeleteParent.origin === 'copies'){
				const parentChildToDelete: CopyNativeEl | CopyCustomComp = copyCopies[compToDeleteParent.key];
				const parentChildren: string[] = isCopyCustomComp(parentChildToDelete) ? copyOriginals[parentChildToDelete.pointer].children : parentChildToDelete.children;
				const parentChildIdx = parentChildren.indexOf(compToDelete.name);
				parentChildren.splice(parentChildIdx, 1);
			}

			const compToDeleteChildren = isCopyCustomComp(compToDelete) ? copyOriginals[compToDelete.pointer].children : compToDelete.children;

			
			// console.log('CHILDREN', compToDeleteChildren);

			if (compToDeleteChildren.length === 0) {
				delete copyCopies[compToDelete.name];
				return;
			}

			for (const child of compToDeleteChildren) {
				console.log('CHILD', child);
				if (isCopyCustomComp(copyCopies[child])) {
					const allCopiesInOriginals = copyOriginals[copyCopies[child].pointer].copies;
					allCopiesInOriginals.splice(allCopiesInOriginals.indexOf(copyCopies[child].name), 1);
				}
				if (copyCopies[child]) {
					deleteCompInCopies(copyCopies[child]);
				} 
			}
			delete copyCopies[compToDelete.name];
		}

		// if custom component, we only want to delete reference to parent, delete copies array of original
		// if (isCopyCustomComp(compToDelete)) {
		// 	// const compToDeleteParent = compToDelete.parent;
		// 	// // delete child from parent's children array
		// 	// if (compToDeleteParent.origin === 'original') {
		// 	// 	const parentChildren: string[] = copyOriginals[compToDeleteParent.key].children;
		// 	// 	const parentChildIdx = parentChildren.indexOf(compToDelete.name);
		// 	// 	parentChildren.splice(parentChildIdx, 1);
		// 	// } else if (compToDeleteParent.origin === 'copies'){
		// 	// 	const parentChildToDelete: CopyNativeEl | CopyCustomComp = copyCopies[compToDeleteParent.key];
		// 	// 	const parentChildren: string[] = isCopyCustomComp(parentChildToDelete) ? copyOriginals[parentChildToDelete.pointer].children : parentChildToDelete.children;
		// 	// 	const parentChildIdx = parentChildren.indexOf(compToDelete.name);
		// 	// 	parentChildren.splice(parentChildIdx, 1);
		// 	// }
		// 	const allCopiesInOriginals = copyOriginals[compToDelete.pointer].copies;
		// 	allCopiesInOriginals.splice(allCopiesInOriginals.indexOf(compToDelete.name), 1);
		// } 
		// else {
			deleteCompInCopies(compToDelete);
		// }

		// console.log('COMP TO DELETE NAME', compToDelete.name);
		
		// console.log('does it reach here???');
		// return [copyCopies, copyOriginals];


		// no matter what component we are touching whether it be custom or native
		// delete it from the COPIES context


		// when looping over compToDelete's children,
		// if the child is a copyCustomComp, then delete its name from originals copies array
		console.log('ORIGINALS AFTER DELETION', copyOriginals);
		console.log('COPIES AFTER DELETION', copyCopies);
	}

	// TODO: Add a modal that asks the user if they are sure they want to delete the component
	// TODO: import type of event object
	// type for event React.MouseEvent<HTMLElement> but hasn't been working, so using any for now
	const handleDeleteClick = (event: any): void => {
		// prevent the click from propagating to the parent div
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();

		console.log('ORIGINALS b4', originals);
		console.log('COPIES b4', copies);
		
		let [newCopies, newOriginals] = [_.cloneDeep(copies), _.cloneDeep(originals)];

		// TODO: deep copy the copies and originals objects

		originals[comp.name].copies.forEach((copyName: string) => {
			// [newCopies, newOriginals] = 
			trashCan(newCopies[copyName], newCopies, newOriginals)
		});
		// console.log('does it reach here???');
		// delete the custom component from originals
		delete newOriginals[comp.name];

		// set copies and originals to the new copies and originals
		setCopies(newCopies);
		setOriginals(newOriginals);

		// console.log('ORIGINALS', originals);
		// console.log('COPIES', copies);

		// if the deleted component is the current component, set current component to null
		if (currentComponent === comp.name) setCurrentComponent('App');
	}

	return (
		<>
			{ComponentItem}
		</>

	)
}

export default ComponentListItem;

// import React, { useContext, useState, useEffect } from 'react';
// import AppContext from '../../context/AppContext';
// import { CopyCustomComp, CopyNativeEl } from '../../parser/interfaces';
// import { Originals, Copies } from '../../parser/interfaces';
// import Modal from './Modal';

// const ComponentListItem = (props: {name: string}): JSX.Element => {
// 	const name = props.name;
// 	const { currentComponent, setCurrentComponent, originals, setOriginals, copies, setCopies } = useContext(AppContext);
// 	const [ComponentItem, setComponentItem] = useState(null);

// 	// Modal states
// 	const [currentModal, setCurrentModal] = useState('');
// 	const [isOpen, setIsOpen] = useState(false);

// 	const handleClick = () => {
// 		setIsOpen(false);
// 		console.log('close button clicked');
// 	}
	
	// useEffect(() => {
	// 	if (name === 'App') {
	// 		currentComponent === name
	// 			? setComponentItem(
	// 				<div className='highlightedComponentListItem'>
	// 					<span> {name} </span>
	// 				</div>
	// 			)
	// 			: setComponentItem(
	// 				<div className='componentListItem' onClick={() => setCurrentComponent(name)}>
	// 					<span> {name} </span>
	// 				</div>
	// 			)
	// 	} else {
	// 		currentComponent === name
	// 			? setComponentItem(
	// 				<div className='highlightedComponentListItem'>
	// 					<span> {name} </span>
	// 					<button onClick={(e) => handleStateClick(e)}>State</button>
	// 					<button onClick={(e) => handleDeleteClick(e)}>Delete</button>
	// 				</div>
	// 			)
	// 			: setComponentItem(
	// 				<div className='componentListItem' onClick={() => setCurrentComponent(name)}>
	// 					<span> {name} </span>
	// 					<button onClick={(e) => handleStateClick(e)}>State</button>
	// 					<button onClick={(e) => handleDeleteClick(e)}>Delete</button>
	// 				</div>
	// 			)
	// 	}
	// }, [currentComponent, originals, copies]);

	
// 	// Deletes all children and the component itself from the copies object and any references to the component in the originals object
// 	const trashCan = (name: string, copyCopies: Copies, copyOriginals: Originals): void => {
// 		const deletedComponent: (CopyNativeEl | CopyCustomComp) = copyCopies[name];
		

// 		// we don't want to activate on copyCustomComp

// 		let children: string[];
// 		// if the component is custom, use the pointer to find the children of its original
// 		// if the component is native, use the children array
// 		deletedComponent.type === 'custom'
// 			? children = copyOriginals[deletedComponent.pointer].children
// 			: children = deletedComponent.children;
		
// 		// recursively call trashCan on all children
// 		children.forEach((child: string): void => trashCan(child, copyCopies, copyOriginals));
// 		// delete the custom component from the parent's children array in ORIGINALS or COPIES
// 		deletedComponent.parent.origin === 'original'
// 			?	copyOriginals[deletedComponent.parent.key].children = copyOriginals[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name)
// 			: copyCopies[deletedComponent.parent.key].children = copyCopies[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name);

// 		// delete the custom component from original's copies array
// 		deletedComponent.type === 'custom' &&
// 			(copyOriginals[deletedComponent.pointer].copies = copyOriginals[deletedComponent.pointer].copies.filter((copy: string): boolean => copy !== name));
		
// 		// delete the copy component instance from COPIES
// 		delete copyCopies[name];
// 	}

// 	// TODO: import type of event object
// 	// type for event React.MouseEvent<HTMLElement> but hasn't been working, so using any for now
// 	const handleDeleteClick = (event: any): void => {

// 		// prevent the click from propagating to the parent div
// 		event.cancelBubble = true;
// 		event.stopPropagation && event.stopPropagation();
		
// 		// TODO: Add a modal that asks the user if they are sure they want to delete the component
// 		setCurrentModal('delete')
// 		setIsOpen(true);
		
// 		// Function to deep copy an object
// 		const deepCopy = (obj: any): any => {
// 			if (typeof obj === 'object') {
// 				if (Array.isArray(obj)) {
// 					let copy: string[] = [];
// 					obj.forEach((item: string): number => copy.push(item));
// 					return copy;
// 				} else {
// 					let copy: {[key: string]: {}} = {};
// 					for (let key in obj) {
// 						copy[key] = deepCopy(obj[key]);
// 					}
// 					return copy;
// 				}
// 			} else return obj;
// 		}
// 		let [newCopies, newOriginals] = [deepCopy(copies), deepCopy(originals)];
// 		originals[name].copies.forEach((copyName: string) => trashCan(copyName, newCopies, newOriginals));

// 		//look at (on original context) TestComponent's children and trash them all
// 		// delete the custom component from originals context
// 		delete newOriginals[name];

// 		// set copies and originals to the new copies and originals
// 		setCopies(newCopies);
// 		setOriginals(newOriginals);

// 		console.log('copies after deletion', newCopies)
// 		console.log('originals after deletion', newOriginals)
		
// 		// if the deleted component is the current component, set current component to null
// 		currentComponent === name && setCurrentComponent('App');
// 	}
	
// 	// TODO: Add a modal for the user to input state
// 	const handleStateClick = (event: any): void => {

// 		// prevent the click from propagating to the parent div
// 		event.cancelBubble = true;
// 		event.stopPropagation && event.stopPropagation();

// 		// TODO: Flesh out state modal
// 		setIsOpen(true)
// 		console.log('clicked state')
// 	}

// 	return (
// 		<>
// 			{ComponentItem}
// 			{isOpen
// 				?
// 				<Modal isOpen={isOpen} handleClick={handleClick}>
// 				</Modal>
// 				:
// 				<></>
//       }
// 		</>

// 	)
// }

// export default ComponentListItem;