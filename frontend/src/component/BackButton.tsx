import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import IcBack from 'src/image/ic-back.svg';
import Body from './typography/Body';

type Props = {
  text: string;
};

const BackButton = ({ text }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="flex w-fit cursor-pointer"
      onClick={() =>
        location.key === 'default' ? navigate(Page.Book, { replace: true }) : navigate(-1)
      }
    >
      <img src={IcBack} />
      <Body size="l" bold className="text-navy-700">
        {text}
      </Body>
    </div>
  );
};

export default BackButton;
