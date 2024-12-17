import { createContext } from 'react';

const defaultVal = { closeDropdown: () => {}};
const DropdownContext = createContext(defaultVal);

export default DropdownContext;
