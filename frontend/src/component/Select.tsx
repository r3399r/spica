import classNames from 'classnames';
import { isValidElement, ReactNode, useMemo, useState } from 'react';
import SelectContext from 'src/context/SelectContext';
import IcSelectDisabled from 'src/image/ic-select-disabled.svg';
import IcSelect from 'src/image/ic-select.svg';
import Modal from './Modal';

/**
 * usage example:
 *
 * <Select>
 *   <SelectOption value="aa">a</SelectOption>
 *   <SelectOption value="bb">b</SelectOption>
 *   <SelectOption value="cc">c</SelectOption>
 * </Select>
 */

type Props = {
  children: ReactNode | ReactNode[];
  label?: string;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
};

const Select = ({
  children,
  label,
  disabled,
  onChange,
  defaultValue,
  value: controlledSelectedValue,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(defaultValue ?? '');

  const options = useMemo(
    () =>
      (Array.isArray(children) ? children : [children]).map((child) =>
        isValidElement(child) ? child.props : null,
      ),
    [],
  );

  const handleChange = (v: string) => {
    setOpen(false);
    if (controlledSelectedValue === undefined) setSelected(v);

    onChange && onChange(v);
  };

  return (
    <SelectContext.Provider value={{ current: controlledSelectedValue ?? selected, handleChange }}>
      <div className="w-full">
        {label && (
          <div
            className={classNames('text-[14px] leading-normal text-navy-700 mb-[5px]', {
              'opacity-30': disabled,
            })}
          >
            {label}
          </div>
        )}
        <div
          className={classNames(
            'rounded bg-grey-200 outline-none p-2 h-[40px] flex justify-between items-center',
            {
              'cursor-pointer': !disabled,
              'cursor-not-allowed': !!disabled,
            },
          )}
          onClick={() => !disabled && setOpen(true)}
        >
          <div
            className={classNames({
              'text-grey-500': !!disabled,
              'text-navy-900': !disabled,
            })}
          >
            {options.find((v) => v.value === (controlledSelectedValue ?? selected))?.children}
          </div>
          <div>{disabled ? <img src={IcSelectDisabled} /> : <img src={IcSelect} />}</div>
        </div>
        <Modal
          open={open}
          handleClose={() => setOpen(false)}
          showClose={false}
          px={false}
          className="py-[12px]"
        >
          <>{children}</>
        </Modal>
      </div>
    </SelectContext.Provider>
  );
};

export default Select;
