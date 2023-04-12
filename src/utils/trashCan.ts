import { CopyCustomComp, CopyNativeEl, OrigCustomComp, AppInterface, Parent } from './interfaces';
import { Originals, Copies } from './interfaces';
import { isCopyCustomComp } from './parser';

 /**
 * @method trashCan
 * @description - removes all traces of a component and its children from a deepCopy of the originals context and the copies context
 * @input - the component from the copy context to be deleted, the deepCopy of the originals context, the deepCopy of the copies context
 * @output - no output
 *           updates the deepCopy of the originals context and the deepCopy of the copies context declared outside of this function
 *           deep copies are passed to the setOriginals and setCopies hooks to update the context
 */


export const trashCan = (compToDelete: CopyNativeEl | CopyCustomComp, copyOriginals: Originals, copyCopies: Copies) => {
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
      const originalParentElement = copyOriginals[parentChildToDelete.pointer] as OrigCustomComp;
			const parentChildren: string[] = isCopyCustomComp(parentChildToDelete) ? originalParentElement.children : parentChildToDelete.children;
      const parentChildIdx = parentChildren.indexOf(compToDelete.name);
      parentChildren.splice(parentChildIdx, 1);
    }

    // find the children of compToDelete
    const originalElement = copyOriginals[compToDelete.pointer] as OrigCustomComp;
    const compToDeleteChildren = isCopyCustomComp(compToDelete) ? originalElement.children : compToDelete.children;
    
    // if compToDelete has no children, delete its instance from the copies context
    if (compToDeleteChildren.length === 0) {
      if (isCopyCustomComp(compToDelete)) {
        const copyInOriginals = copyOriginals[compToDelete.pointer] as OrigCustomComp;
        const copyCompToDelete: string[] = copyInOriginals.copies;
        const copyCompToDeleteIdx = copyCompToDelete.indexOf(compToDelete.name);
        copyCompToDelete.splice(copyCompToDeleteIdx, 1);
      }
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