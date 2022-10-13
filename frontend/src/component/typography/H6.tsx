import classNames from 'classnames';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H6 = ({ className, ...props }: Props) => (
  <h6 className={classNames('font-bold text-[0.875rem] leading-normal', className)} {...props} />
);

export default H6;
