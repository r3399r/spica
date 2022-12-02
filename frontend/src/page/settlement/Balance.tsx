import classNames from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Divider from 'src/celestial-ui/component/Divider';
import Body from 'src/celestial-ui/component/typography/Body';
import { RootState } from 'src/redux/store';
import { bn } from 'src/util/bignumber';

const Balance = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members ?? [], [id, books]);

  return (
    <>
      {members.map((v) => (
        <div key={v.id}>
          <div className="flex py-[10px] gap-[10px] justify-between items-center">
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
