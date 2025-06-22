import classNames from 'classnames';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H3 = ({ className, ...props }: Props) => (
  <h3 className={classNames('m-0 text-[1.5rem] leading-[1.3] font-bold', className)} {...props} />
);

export default H3;
