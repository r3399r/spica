import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H6 = (props: Props) => <h6 className="text-[0.875rem] leading-normal" {...props} />;

export default H6;
