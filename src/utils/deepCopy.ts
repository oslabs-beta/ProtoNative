import { Originals, Copies } from "./interfaces";

export const deepCopy = (collection: (Originals | Copies)): (Originals | Copies) => {
  if (typeof collection !== "object" || collection === null) return collection;
  const output: {[key: string]: any} = Array.isArray(collection) ? [] : {};
  for (const [key, value] of Object.entries(collection)) {
    output[key] = deepCopy(value);
  }
  return output;
}