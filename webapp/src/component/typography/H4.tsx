import classNames from 'classnames';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H4 = ({ className, ...props }: Props) => (
  <h4 className={classNames('m-0 text-[1.25rem] leading-[1.4] font-bold', className)} {...props} />
);

export default H4;
