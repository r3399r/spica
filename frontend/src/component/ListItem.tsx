import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import Body from './typography/Body';

type Props = HTMLAttributes<HTMLDivElement> & { focus?: boolean };

const ListItem = ({ children, focus, className, ...props }: Props) => (
  <Body
    size="l"
    className={classNames('p-[10px] active:bg-grey-300', className, { 'text-teal-500': focus })}
    {...props}
  >
    {children}
  </Body>
);

export default ListItem;
