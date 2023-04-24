import { forwardRef, InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Radio = forwardRef<HTMLInputElement, Props>(({ label, id, ...props }, ref) => (
  <div className="flex w-fit items-center my-[10px]">
    <input
      className="appearance-none cursor-pointer rounded-full w-5 h-5 border-2 border-navy-900 opacity-30 transition-all m-0 bg-clip-content p-[3px] checked:border-teal-500 checked:bg-teal-500 checked:opacity-100"
      {...props}
      type="radio"
      id={id}
      ref={ref}
    />
    {label && (
      <label className="pl-3" htmlFor={id}>
        {label}
      </label>
    )}
  </div>
));

export default Radio;
