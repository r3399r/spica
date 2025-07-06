import classNames from 'classnames';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H5 = ({ className, ...props }: Props) => (
  <h5 className={classNames('m-0 leading-normal font-bold', className)} {...props} />
);

export default H5;
