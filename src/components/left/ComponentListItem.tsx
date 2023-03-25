import React, { useContext, useState, useEffect, useCallback } from 'react';
import AppContext from '../../context/AppContext';
import { CopyCustomComp, CopyNativeEl, OrigCustomComp, AppInterface } from '../../parser/interfaces';


type ComponentListItemProps = {
	name: string;
}

const ComponentListItem = (props: ComponentListItemProps): JSX.Element => {
	const name = props.name;
	const { currentComponent, setCurrentComponent, originals, setOriginals, copies, setCopies } = useContext(AppContext);
	const [ComponentItem, setComponentItem] = useState(null);

	const handleHighlight = useCallback((): void => {
		if (currentComponent !== name) setCurrentComponent(name);
	}, [currentComponent]);
	
	// if the name is 'app', do not render the delete button and do not allow the user to click on the component
	useEffect(() => {
		if (name === 'App') {
			setComponentItem(
				<div className='componentListItem'>
					<span> {name} </span>
				</div>
			)
		} else {
			if (currentComponent === name) {
				setComponentItem(
					<div className='highlightedComponentListItem' onClick={() => handleHighlight()}>
						<span> {name} </span>
						<button onClick={(e) => handleStateClick(e)}>State</button>
						<button onClick={(e) => handleDeleteClick(e)}>Delete</button>
					</div>
				)
			} else {
				setComponentItem(
					<div className='componentListItem' onClick={() => handleHighlight()}>
						<span> {name} </span>
						<button onClick={(e) => handleStateClick(e)}>State</button>
						<button onClick={(e) => handleDeleteClick(e)}>Delete</button>
					</div>
				)
			}
		}
	}, [currentComponent]);

	// TODO: Add a modal for the user to input state
	const handleStateClick = (event: any): void => {
		event.cancelBubble = true;
		if(event.stopPropagation) event.stopPropagation();
	}

	// takes in a name and the copies and originals objects and returns a new copies and originals objects with the component and all of its children deleted
	const trashCan = (name: string, copyCopies: typeof copies, copyOriginals: typeof originals) => {

		// helper function to recursively delete all instances of a component and its children from clone of copies and originals objects
		const helper = (name: string) => {
			const deletedComponent: (CopyNativeEl | CopyCustomComp) = copyCopies[name];
			let children: string[];

			// different methods for getting children depending on whether the component is a custom component or a native element
			deletedComponent.type === 'custom'
			? children = deletedComponent.children()
			: children = deletedComponent.children;

			// recursively call trashCan on all children
			children.forEach((child: string): void => helper(child));

			// delete the custom component from original's copies array
			if (deletedComponent.type === 'custom') {
				copyOriginals[deletedComponent.pointer].copies = copyOriginals[deletedComponent.pointer].copies.filter((copy: string): boolean => copy !== name);
			}

			// delete the custom component from the parent's children array in ORIGINALS or COPIES
			deletedComponent.parent.origin === 'original'
			? copyOriginals[deletedComponent.parent.key].children = copyOriginals[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name)
			: copyCopies[deletedComponent.parent.key].children = copyCopies[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name);

			// delete the copy from COPIES
			delete copyCopies[name];
		}

		helper(name);
		return [copyCopies, copyOriginals];
	}


	// TODO: Add a modal that asks the user if they are sure they want to delete the component
	const handleDeleteClick = (event: any): void => {
		// prevent the click from propagating to the parent div
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();

		// delete all the copies of the custom component from copies
		console.log(originals)
		let [newCopies, newOriginals] = [JSON.parse(JSON.stringify(copies)), JSON.parse(JSON.stringify(originals))];
		originals[name].copies.forEach((copy: string) => [newCopies, newOriginals] = trashCan(copy, newCopies, newOriginals));
		
		// delete the custom component from originals
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