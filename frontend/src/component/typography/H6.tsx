import classNames from 'classnames';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H6 = ({ className, ...props }: Props) => (
  <h6
    className={classNames('m-0 text-[0.875rem] leading-normal font-bold', className)}
    {...props}
  />
);

export default H6;
