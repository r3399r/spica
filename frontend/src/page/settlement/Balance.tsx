import classNames from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Divider from 'src/celestial-ui/component/Divider';
import Body from 'src/celestial-ui/component/typography/Body';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import { bn } from 'src/util/bignumber';

const Balance = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const book = useBook();
  const members = useMemo(() => book?.members ?? [], [book]);

  return (
    <>
      {members.map((v) => (
        <div key={v.id}>
          <div
            className="flex py-[10px] gap-[10px] justify-between items-center cursor-pointer"
            onClick={() => navigate(`${Page.Book}/${id}/settlement/${v.id}`)}
          >
            <Body size="l" className="text-navy-700">
              {v.nickname}
            </Body>
            <div className="flex gap-[10px] items-center">
              <Body
                size="s"
                className={classNames('bg-grey-200 px-1 py-[3px] whitespace-nowrap', {
                  'text-tomato-700': v.total < 0,
                  'text-green-700': v.total >= 0,
                })}
              >
                {v.total < 0 ? t('desc.out') : t('desc.in')}
              </Body>
              <Body size="l" className="text-navy-700">{`${book?.symbol}${bn(v.total)
                .abs()
                .toFormat()}`}</Body>
            </div>
          </div>
          <Divider />
        </div>
      ))}
    </>
  );
};

export default Balance;
