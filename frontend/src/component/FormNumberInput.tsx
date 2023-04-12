import { Controller, useFormContext } from 'react-hook-form';
import NumberInput, { Props as NumberInputProps } from './NumberInput';

/**
 * This component should be put inside Form component:
 * <Form methods={methods} onSubmit={onSubmit}>
 *   <FormNumberInput name="a" />
 * </Form>
 * */

type Props = NumberInputProps & {
  name: string;
  required?: boolean;
};

const FormNumberInput = ({ name, required = false, defaultValue, ...props }: Props) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue ?? ''}
      rules={{ required }}
      render={({ field }) => (
        <NumberInput
          {...field}
          {...props}
          error={errors[name]?.message?.toString() || !!errors[name]}
        />
      )}
    />
  );
};

export default FormNumberInput;
