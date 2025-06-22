import { ImgHTMLAttributes } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  srcActive?: string;
};

const Img = ({ src, srcActive, onMouseDown, onMouseLeave, ...props }: Props) => (
  <img
    src={src}
    onMouseDown={(e) => {
      if (srcActive) e.currentTarget.src = srcActive;
      onMouseDown && onMouseDown(e);
    }}
    onMouseLeave={(e) => {
      if (src && srcActive) e.currentTarget.src = src;
      onMouseLeave && onMouseLeave(e);
    }}
    {...props}
  />
);

export default Img;
