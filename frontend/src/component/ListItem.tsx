import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import Body from './typography/Body';

type Props = HTMLAttributes<HTMLDivElement> & { focus?: boolean };

const ListItem = ({ children, focus, className, ...props }: Props) => (
  <Body
    size="l"
    className={classNames('active:bg-grey-300 p-[10px]', className, { 'text-teal-500': focus })}
    {...props}
  >
    {children}
  </Body>
);

export default ListItem;
