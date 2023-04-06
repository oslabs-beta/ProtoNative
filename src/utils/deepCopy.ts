import { Originals, Copies } from "./interfaces";

/**
 * @method deepCopy
 * @description - deep copies an object
 * @input - collection (object to be copied)
 * @output - deep copy of the object
 */

export const deepCopy = (collection: (Originals | Copies)): (Originals | Copies) => {
  if (typeof collection !== "object" || collection === null) return collection;
  const output: {[key: string]: any} = Array.isArray(collection) ? [] : {};
  for (const [key, value] of Object.entries(collection)) {
    output[key] = deepCopy(value);
  }
  return output;
}