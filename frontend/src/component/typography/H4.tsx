import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHeadingElement>;

const H4 = (props: Props) => <h4 className="font-bold text-[1.25rem] leading-[1.4]" {...props} />;

export default H4;
