import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Body from 'src/celestial-ui/component/typography/Body';
import { Page } from 'src/constant/Page';
import { HistoryContext } from 'src/context/HistoryContext';
import IcBack from 'src/image/ic-back.svg';

type Props = {
  text: string;
};

const BackButton = ({ text }: Props) => {
  const navigate = useNavigate();
  const { stack } = useContext(HistoryContext);

  return (
    <div
      className="flex cursor-pointer w-fit"
      onClick={() => (stack.length === 0 ? navigate(Page.Book, { replace: true }) : navigate(-1))}
    >
      <img src={IcBack} />
      <Body size="l" bold className="text-navy-700">
        {text}
      </Body>
    </div>
  );
};

export default BackButton;
