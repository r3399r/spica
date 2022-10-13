import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H6 = (props: Props) => <h6 className="font-bold text-[0.875rem] leading-normal" {...props} />;

export default H6;
