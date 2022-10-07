import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H2 = (props: Props) => <h2 className="font-bold text-[1.75rem] leading-[1.2]" {...props} />;

export default H2;
