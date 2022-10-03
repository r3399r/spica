import { ChangeEvent, InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  regex?: RegExp;
};

const Input = ({ regex, onChange, ...props }: Props) => {
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (regex !== undefined && regex.test(e.target.value) === false) return;
    onChange && onChange(e);
  };

  return <input onChange={onInput} {...props} />;
};

export default Input;
