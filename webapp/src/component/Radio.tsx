import { forwardRef, InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Radio = forwardRef<HTMLInputElement, Props>(({ label, id, ...props }, ref) => (
  <div className="my-[10px] flex items-center">
    <input
      className="m-0 h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-navy-900 bg-clip-content p-[3px] opacity-30 transition-all checked:border-teal-500 checked:bg-teal-500 checked:opacity-100"
      {...props}
      type="radio"
      id={id}
      ref={ref}
    />
    {label && (
      <label className="flex-1 pl-3 leading-none" htmlFor={id}>
        {label}
      </label>
    )}
  </div>
));

export default Radio;
