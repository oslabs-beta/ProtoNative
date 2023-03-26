import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { CopyCustomComp, CopyNativeEl } from '../../parser/interfaces';
import { Originals, Copies } from '../../parser/interfaces';

type ComponentListItemProps = {
	name: string;
}

const ComponentListItem = (props: ComponentListItemProps): JSX.Element => {
	const name = props.name;
	const { currentComponent, setCurrentComponent, originals, setOriginals, copies, setCopies } = useContext(AppContext);
	const [ComponentItem, setComponentItem] = useState(null);
	
	// if the name is 'app', do not render the delete button and do not allow the user to click on the component
	useEffect(() => {
		if (name === 'App') {
			if (currentComponent === null) {
				setComponentItem(
					<div className='highlightedComponentListItem'>
						<span> {name} </span>
					</div>
				)
			} else {
				setComponentItem(
					<div className='componentListItem' onClick={() => setCurrentComponent(null)}>
						<span> {name} </span>
					</div>
				)
			}
		} else {
			if (currentComponent === name) {
				setComponentItem(
					<div className='highlightedComponentListItem'>
						<span> {name} </span>
						<button onClick={(e) => handleStateClick(e)}>State</button>
						<button onClick={(e) => handleDeleteClick(e)}>Delete</button>
					</div>
				)
			} else {
				setComponentItem(
					<div className='componentListItem' onClick={() => setCurrentComponent(name)}>
						<span> {name} </span>
						<button onClick={(e) => handleStateClick(e)}>State</button>
						<button onClick={(e) => handleDeleteClick(e)}>Delete</button>
					</div>
				)
			}
		}
	}, [currentComponent, originals, copies]);

	// TODO: Add a modal for the user to input state
	const handleStateClick = (event: any): void => {

		// prevent the click from propagating to the parent div
		event.cancelBubble = true;
		if(event.stopPropagation) event.stopPropagation();
	}

	// Deletes all children and the component itself from the copies object and any references to the component in the originals object
	const trashCan = (name: string, copyCopies: Copies, copyOriginals: Originals): void => {
		const deletedComponent: (CopyNativeEl | CopyCustomComp) = copyCopies[name];

		let children: string[];
		// if the component is custom, use the pointer to find the children of its original
		// if the component is native, use the children array
		(deletedComponent.type === 'custom')
		? children = copyOriginals[deletedComponent.pointer].children
		: children = deletedComponent.children;

		// recursively call trashCan on all children
		children.forEach((child: string): void => trashCan(child, copyCopies, copyOriginals));
		// delete the custom component from the parent's children array in ORIGINALS or COPIES
		(deletedComponent.parent.origin === 'original')
		?	copyOriginals[deletedComponent.parent.key].children = copyOriginals[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name)
		: copyCopies[deletedComponent.parent.key].children = copyCopies[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name);

		// delete the custom component from original's copies array
		if (deletedComponent.type === 'custom') {
			copyOriginals[deletedComponent.pointer].copies = copyOriginals[deletedComponent.pointer].copies.filter((copy: string): boolean => copy !== name);
		}

		// delete the copy component instance from COPIES
		delete copyCopies[name];
	}


	// TODO: Add a modal that asks the user if they are sure they want to delete the component
	// TODO: import type of event object
	// type for event React.MouseEvent<HTMLElement> but hasn't been working, so using any for now
	const handleDeleteClick = (event: any): void => {

		// prevent the click from propagating to the parent div
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();

		// Function to deep copy an object
		const deepCopy = (obj: any): any => {
			if (typeof obj === 'object') {
				if (Array.isArray(obj)) {
					let copy: string[] = [];
					obj.forEach((item: string): number => copy.push(item));
					return copy;
				} else {
					let copy: {[key: string]: {}} = {};
					for (let key in obj) {
						copy[key] = deepCopy(obj[key]);
					}
					return copy;
				}
			} else return obj;
		}
		
		let [newCopies, newOriginals] = [deepCopy(copies), deepCopy(originals)];
		originals[name].copies.forEach((copyName: string) => trashCan(copyName, newCopies, newOriginals));
		
		// delete the custom component from originals context
		delete newOriginals[name];

		// set copies and originals to the new copies and originals
		setCopies(newCopies);
		setOriginals(newOriginals);

		// if the deleted component is the current component, set current component to null
		if (currentComponent === name) setCurrentComponent(null);
	}

	return (
		<>
			{ComponentItem}
		</>

	)
}

export default ComponentListItem;