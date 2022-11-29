import NumberInput, { Props as InputProps } from 'src/celestial-ui/NumberInput';

type Props = InputProps & {
  symbol: string;
};

const AmountInput = ({ symbol, ...props }: Props) => <NumberInput startsWith={symbol} {...props} />;

export default AmountInput;
