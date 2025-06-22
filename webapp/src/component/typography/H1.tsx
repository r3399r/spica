import classNames from 'classnames';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H1 = ({ className, ...props }: Props) => (
  <h1 className={classNames('m-0 text-[2.125rem] leading-[1.2] font-bold', className)} {...props} />
);

export default H1;
