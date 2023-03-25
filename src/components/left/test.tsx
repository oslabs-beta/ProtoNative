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

	const trashCan = (name: string): void => {
		const deletedComponent: (CopyNativeEl | CopyCustomComp) = copies[name];
		let children: string[];


		// different methods for getting children depending on whether the component is a custom component or a native element
    (deletedComponent.type === 'custom')
    ? (children = deletedComponent.children())
    : (children = deletedComponent.children);

    // recursively call trashCan on all children
		children.forEach((child: string): void => trashCan(child));

    // delete the custom component from original's copies array
    (deletedComponent.type === 'custom')
    ? setOriginals((previous: typeof originals): typeof originals => {
        const newOriginal = {
          ...previous[deletedComponent.pointer],
          copies: previous[deletedComponent.pointer].copies.filter((copy: string): boolean => copy !== name),
        };
        return {
          ...previous,
          [deletedComponent.pointer]: newOriginal,
        };
      })
    : null;

    // delete the custom component from the parent's children array in ORIGINALS or COPIES
		(deletedComponent.parent.origin === 'original')
    ? setOriginals((previous: typeof originals): typeof originals => {
				const newOriginal = {
					...previous[deletedComponent.parent.key],
					children: previous[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name),
				};
				return {
					...previous,
					[deletedComponent.parent.key]: newOriginal,
				};
			})
    : setCopies((previous: any): typeof copies => {
				const newCopy = {
					...previous[deletedComponent.parent.key],
					children: previous[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name),
				};
				return {
					...previous,
					[deletedComponent.parent.key]: newCopy,
				}
			});

    // delete the copy from COPIES
		setCopies((previous: typeof copies): typeof copies => {
			const newCopies = { ...previous };
			delete newCopies[name as keyof typeof previous];
			return newCopies;
		});
	}

  // TODO: Add a modal that asks the user if they are sure they want to delete the component
	const handleDeleteClick = (event: any): void => {
    // prevent the click from propagating to the parent div
    event.cancelBubble = true;
    if (event.stopPropagation) event.stopPropagation();

    // delete all the copies of the custom component from copies
    console.log('ORIGINALS COPIES: ', originals[name].copies)
    originals[name].copies.forEach((copyName) => trashCan(copyName));
		

		// delete the custom component from originals
		setOriginals((previous: typeof originals): typeof originals => {
			const newOriginals = { ...previous };
			delete newOriginals[name as keyof typeof previous];
			return newOriginals;
		});

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