import React, { useContext, useState, useEffect, useCallback } from 'react';
import AppContext from '../../context/AppContext';
import { CopyCustomComp, CopyNativeEl, OrigCustomComp, AppInterface } from '../../parser/interfaces';
import { Originals, Copies } from '../../parser/interfaces';

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
	const trashCan = (name: string, copyCopies: Copies, copyOriginals: Originals) => {

		// change all copies children arrays
		// feed it the name of the Original custom component and the name of the child to be deleted
		// it will loop over all copies in its copies array
		// it will delete the child to be deleted from the children array of each copy

		// helper function to recursively delete all instances of a component and its children from clone of copies and originals objects
		const helper = (name: string) => {
			const deletedComponent: (CopyNativeEl | CopyCustomComp) = copyCopies[name];
			let children: string[] = deletedComponent.children;



			// // different methods for getting children depending on whether the component is a custom component or a native element
			// console.log('deletedComponent', deletedComponent)
			// deletedComponent.type === 'custom'
			// ? children = deletedComponent.children() // Do we see the old state where the child is still there or is it updated?
			// : children = deletedComponent.children;

			// recursively call trashCan on all 
			children.forEach((child: string): void => helper(child));

			// delete the custom component from the parent's children array in ORIGINALS or COPIES
			if (deletedComponent.parent.origin === 'original') {
				copyOriginals[deletedComponent.parent.key].children = copyOriginals[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name);
				setOriginals(copyOriginals); // parent has one less child
			} else copyCopies[deletedComponent.parent.key].children = copyCopies[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name);

			// delete the custom component from original's copies array
			if (deletedComponent.type === 'custom') {
				copyOriginals[deletedComponent.pointer].copies = copyOriginals[deletedComponent.pointer].copies.filter((copy: string): boolean => copy !== name);
			}


			// delete the copy from COPIES
			delete copyCopies[name];

		}

		helper(name);
		return [copyCopies, copyOriginals];
	}


	// TODO: Add a modal that asks the user if they are sure they want to delete the component
	// TODO: import type of event object
	// type for event React.MouseEvent<HTMLElement> but hasn't been working, so using any for now
	const handleDeleteClick = (event: any): void => {
		// prevent the click from propagating to the parent div
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();

		// delete all the copies of the custom component from copies
		
		// Deep copy the copies and originals objects so that the original copies and originals objects are not mutated
		const deepCopy = (obj: Originals | Copies) => {
			// if (typeof obj !== 'object') return obj;
			// const newObj: Originals | Copies = Array.isArray(obj) ? [] : {};
			// for (const [key, value] of Object.entries(obj)) {
			// 	newObj[key] = deepCopy(value);
			// }
			// return newObj;
			const newObj: Originals | Copies = {};
			for (let key in obj) {
				if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) newObj[key] = deepCopy(obj[key]);
				else newObj[key] = obj[key];
			}
			return newObj;
		}
		
		let [newCopies, newOriginals] = [deepCopy(copies), deepCopy(originals)];

		// change all children methods of the custom copy components in newCopies to point towards the children arrays of newOriginals

		console.log('LOOK HERE!!!!!!!: ', newCopies.TestComponent0 === copies.TestComponent0)
		console.log(newCopies.TestComponent0, copies.TestComponent0)
		// TODO: deep copy the copies and originals objects

		originals[name].copies.forEach((copyName: string) => [newCopies, newOriginals] = trashCan(copyName, newCopies, newOriginals));
		
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