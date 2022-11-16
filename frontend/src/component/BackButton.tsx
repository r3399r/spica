import { useNavigate } from 'react-router-dom';
import IcBack from 'src/image/ic-back.svg';
import Body from './celestial-ui/typography/Body';

type Props = {
  text: string;
  to: string;
};

const BackButton = ({ text, to }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex cursor-pointer w-fit" onClick={() => navigate(to, { replace: true })}>
      <img src={IcBack} />
      <Body size="l" bold className="text-navy-700">
        {text}
      </Body>
    </div>
  );
};

export default BackButton;
