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
		if (name === 'app') {
			setComponentItem(
				<div className='componentListItem'>
					{name}
				</div>
			)
		} else {
			if (currentComponent === name) {
				setComponentItem(
					<div className='highlightedComponentListItem'>
						<span onClick={() => handleHighlight()}> {name} </span>
						<button onClick={() => handleStateClick()}>State</button>
						<button onClick={() => handleDeleteClick()}>Delete</button>
					</div>
				)
			} else {
				setComponentItem(
					<div className='componentListItem'>
						<span onClick={() => handleHighlight()}> {name} </span>
						<button onClick={() => handleStateClick()}>State</button>
						<button onClick={() => handleDeleteClick()}>Delete</button>
					</div>
				)
			}
		}
	}, [currentComponent]);

	// TODO: will have two buttons: state and delete
	const handleStateClick = () => {

	}

	const trashCan = (name: string): void => {
		const deletedComponent: (CopyNativeEl | CopyCustomComp) = copies[name];
		let children: string[];
		if (deletedComponent.type === 'custom') {
			children = deletedComponent.children();
		} else {
			children = deletedComponent.children;
		}

		children.forEach((child: string): void => {
			trashCan(child);
		});

		if (deletedComponent.parent.origin === 'original') {
			setOriginals((previous: typeof originals): typeof originals => {
				const newOriginal = {
					...previous[deletedComponent.parent.key],
					children: previous[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name),
				};
				return {
					...previous,
					[deletedComponent.parent.key]: newOriginal,
				};
			});
		} else {
			setCopies((previous: any): typeof copies => {
				const newCopy = {
					...previous[deletedComponent.parent.key],
					children: previous[deletedComponent.parent.key].children.filter((child: string): boolean => child !== name),
				};
				return {
					...previous,
					[deletedComponent.parent.key]: newCopy,
				}
			});
		}

		setCopies((previous: typeof copies): typeof copies => {
			const newCopies = { ...previous };
			delete newCopies[name as keyof typeof previous];
			return newCopies;
		});
	}

	const handleDeleteClick = (): void => {
		// extract the copies from the originals object
		const copiesRefs = originals[name].copies;
		
		// delete all the copies of the custom component from copies
		for (let i = 0; i < copiesRefs.length; i++) {
			trashCan(copiesRefs[i]);
		}
		// delete the custom component from originals
		setOriginals((previous: typeof originals): typeof originals => {
			const newOriginals = { ...previous };
			delete newOriginals[name as keyof typeof previous];
			return newOriginals;
		});
		if (currentComponent === name) setCurrentComponent(null);
	}

	return (
		<>
			{ComponentItem}
		</>

	)
}

export default ComponentListItem;