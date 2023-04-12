import { MultiSelectUnstyled, MultiSelectUnstyledProps } from '@mui/base';
import { ForwardedRef, forwardRef } from 'react';

const MultiSelect = forwardRef(
  // eslint-disable-next-line
  (props: MultiSelectUnstyledProps<string>, ref: ForwardedRef<any>) => {
    const slotProps: MultiSelectUnstyledProps<string>['slotProps'] = {
      root: {
        className: 'bg-grey-200 min-h-[40px] min-w-[200px] rounded transition-all text-left p-2',
      },
      listbox: {
        className:
          'bg-grey-200 p-1.5 my-1.5 min-w-[200px] rounded shadow-md overflow-auto max-h-[320px]',
      },
      popper: { className: 'z-10' },
      ...props.slotProps,
    };

    return <MultiSelectUnstyled {...props} ref={ref} slotProps={slotProps} />;
  },
);

export default MultiSelect;
