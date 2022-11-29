import { useLocation, useNavigate } from 'react-router-dom';
import Body from 'src/celestial-ui/typography/Body';
import { Page } from 'src/constant/Page';
import IcBack from 'src/image/ic-back.svg';

type Props = {
  text: string;
};

const BackButton = ({ text }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="flex cursor-pointer w-fit"
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
