import classNames from 'classnames';
import { InputHTMLAttributes } from 'react';

/**
 * usage example:
 *
 * const [state, setState] = useState({
 *   gilad: true,
 *   jason: false,
 *   antoine: false,
 * });
 * const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
 *   setState({ ...state, [event.target.name]: event.target.checked });
 * };
 * const { gilad, jason, antoine } = state;
 *
 *
 * <Checkbox checked={gilad} onChange={handleChange} name="gilad" label="Gilad" />
 * <Checkbox checked={jason} onChange={handleChange} name="jason" label="Jason" />
 * <Checkbox checked={antoine} onChange={handleChange} name="antoine" label="Antoine" />
 */

type Props = InputHTMLAttributes<HTMLInputElement>;

const Checkbox = ({ disabled, ...props }: Props) => (
  <input
    className={classNames(
      'relative appearance-none cursor-pointer bg-transparent border border-solid rounded-[2px] p-[9px] m-0 border-navy-900 opacity-30',
      'checked:bg-teal-500 checked:opacity-100 checked:border-teal-500',
      'checked:after:absolute checked:after:top-0.5 checked:after:left-1.5 checked:after:w-1.5 checked:after:h-3 checked:after:border-r-2 checked:after:border-b-2 checked:after:rotate-45 checked:after:border-white',
    )}
    disabled={disabled}
    {...props}
    type="checkbox"
  />
);

export default Checkbox;
