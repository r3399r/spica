import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H5 = (props: Props) => <h5 className="leading-normal" {...props} />;

export default H5;
