import classNames from 'classnames';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H1 = ({ className, ...props }: Props) => (
  <h1 className={classNames('font-bold text-[2.125rem] leading-[1.2]', className)} {...props} />
);

export default H1;
