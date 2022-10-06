import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H1 = (props: Props) => <h1 className="font-bold text-[2.125rem] leading-[1.2]" {...props} />;

export default H1;
