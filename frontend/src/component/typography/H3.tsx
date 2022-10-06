import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H3 = (props: Props) => <h3 className="font-bold text-[1.5rem] leading-[1.3]" {...props} />;

export default H3;
