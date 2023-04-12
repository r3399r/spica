import classNames from 'classnames';
import { HTMLAttributes } from 'react';

export type Props = HTMLAttributes<HTMLDivElement> & {
  size?: 'l' | 'm' | 's';
  bold?: boolean;
};

const Body = ({ size = 'm', bold = false, className, ...props }: Props) => (
  <div
    className={classNames(className, {
      'font-bold': bold,
      'text-base': size === 'l',
      'text-[14px] leading-normal': size === 'm',
      'text-[12px] leading-normal': size === 's',
    })}
    {...props}
  />
);

export default Body;
