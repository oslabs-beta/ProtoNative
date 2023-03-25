import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import Modal from './Modal';


const ComponentListItem = (props) => {
    const name = props.name;
    const { currentComponent, setCurrentComponent, originals, setOriginals, copies, setCopies } = useContext(AppContext);
    const [isHighlighted, setIsHighlighted] = useState('componentListItem');
    const [ComponentItem, setComponentItem] = useState(null);
    const [currentModal, setCurrentModal] = useState('');
    const [isOpen, setIsOpen] = useState(false);

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

    const handleClick = () => {
        setIsOpen(false)
        console.log('close button clicked')
    }
    const handleStateClick = () => {
        setIsOpen(true)
        console.log('clicked state')
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
        setCurrentModal('delete')
        setIsOpen(true);

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

    useEffect(() => {
        if (name === 'app') {
            setComponentItem(
                <div className={ComponentListItem}>
                    {name}
                    <button onClick={() => handleStateClick()}>State</button>
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
    return (
        <>
            {ComponentItem}
            {isOpen
                ?
                <Modal isOpen={isOpen} handleClick={handleClick}>
                </Modal>
                :
                <></>

            }
        </>

    )
}

export default ComponentListItem;