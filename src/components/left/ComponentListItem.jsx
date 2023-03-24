import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';


const ComponentListItem = (props) => {
    const name = props.name;
    const { currentComponent, setCurrentComponent, originals, setOriginals, copies, setCopies } = useContext(AppContext);
    const [isHighlighted, setIsHighlighted] = useState('componentListItem');
    const [ComponentItem, setComponentItem] = useState(null);

    useEffect(() => {
        if (currentComponent === name) {
            setIsHighlighted('highlightedComponentListItem');
        } else {
            setIsHighlighted('componentListItem');
        }
    }, [currentComponent]);

    // if the name is 'app', do not render the delete button and do not allow the user to click on the component
    const handleHighlight = () => {
        // setCurrentComponent(name);
    }

    useEffect(() => {
        if (name === 'app') {
            setComponentItem(
                <div className={ComponentListItem}>
                    {name}
                </div>
            )
        } else {
            setComponentItem(
                <div className={isHighlighted} onClick={() => handleHighlight()}>
                    {name}
                    <button onClick={() => handleStateClick()}>State</button>
                    <button onClick={() => handleDeleteClick()}>Delete</button>
                </div>
            )
        }
    }, []);

    // TODO: will have two buttons: state and delete
    const handleStateClick = () => {

    }

    const trashCan = (name) => {
        const deletedComponent = copies[name];
        let children;
        if (deletedComponent.type === 'custom') {
            children = deletedComponent.children();
        } else {
            children = deletedComponent.children;
            // console.log(children);
        }

        children.forEach(child => {
            trashCan(child);
        });

        if (deletedComponent.parent.origin === 'original') {
            setOriginals((previous) => {
                // console.log('ORIGINAL OBJECT BEFORE DELETION: ', originals[deletedComponent.parent.key])
                const newOriginal = {
                    ...originals[deletedComponent.parent.key],
                    children: originals[deletedComponent.parent.key].children.filter(child => child !== name),
                };
                // console.log('newOriginal OBJECT: ', newOriginal)
                return {
                    ...previous,
                    [deletedComponent.parent.key]: newOriginal,
                };
            });
        } else {
            setCopies((previous) => {
                // console.log('COPY OBJECT BEFORE DELETION: ', copies[deletedComponent.parent.key])
                const newCopy = {
                    ...copies[deletedComponent.parent.key],
                    children: copies[deletedComponent.parent.key].children.filter(child => child !== name),
                };
                // console.log('COPY OBJECT: ', newCopy)
                return {
                    ...previous,
                    [deletedComponent.parent.key]: newCopy,
                }
            });
        }

        setCopies((previous) => {
            const newCopies = { ...previous };
            delete newCopies[name];
            return newCopies;
        });

        // console.log('TRASH CAN DONE: ', name)
    }

    const handleDeleteClick = () => {
        // extract the copies from the originals object
        const copiesRefs = originals[name].copies;

        // delete the custom component from originals
        console.log('ORIGINALS BEFORE DELETION: ', originals) // FIXME: this is not updating
        const newOriginals = { ...originals };
        delete newOriginals[name];
        setOriginals(newOriginals);
        console.log('ORIGINALS AFTER DELETION: ', newOriginals)
        // delete all the copies of the custom component from copies
        for (let i = 0; i < copiesRefs.length; i++) {
            trashCan(copiesRefs[i]);
        }
        if (currentComponent === name) setCurrentComponent(null);
    }

    return (
        <>
            {ComponentItem}
        </>

    )
}

export default ComponentListItem;