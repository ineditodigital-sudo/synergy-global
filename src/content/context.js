import { createContext, useContext } from 'react';
import { DEFAULT_CONTENT } from './defaults.js';

export const ContentContext = createContext(DEFAULT_CONTENT);

/** The published (or, inside the CMS preview, the draft) site content. */
export function useContent() {
  return useContext(ContentContext);
}
