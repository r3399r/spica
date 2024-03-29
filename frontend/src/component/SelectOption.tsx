import { ReactNode } from 'react';
import SelectContext from 'src/context/SelectContext';
import ListItem from './ListItem';

/**
 * usage note:
 * this component is for Select component, please use this only with it.
 */

type Props = {
  value: string;
  children: ReactNode;
};

const SelectOption = ({ value, children }: Props) => (
  <SelectContext.Consumer>
    {({ current, handleChange }) => (
      <ListItem onClick={() => handleChange(value)} focus={current === value}>
        {children}
      </ListItem>
    )}
  </SelectContext.Consumer>
);

export default SelectOption;
