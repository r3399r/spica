import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/celestial-ui/component/Button';
import Body from 'src/celestial-ui/component/typography/Body';
import H2 from 'src/celestial-ui/component/typography/H2';
import H5 from 'src/celestial-ui/component/typography/H5';
import { Page } from 'src/constant/Page';
import IcAdd from 'src/image/ic-add.svg';
import IcBook from 'src/image/ic-book.svg';
import IcConfig from 'src/image/ic-config.svg';
import PicBookHero from 'src/image/pic-book-hero.svg';
import { RootState } from 'src/redux/store';
import { setTxPageScroll } from 'src/redux/uiSlice';
import { loadBookList } from 'src/service/bookService';
import ModalNewBook from './ModalNewBook';

const BookList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    loadBookList();
    dispatch(setTxPageScroll(0));
  }, []);

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <div className="float-right">
            <img src={IcConfig} className="cursor-pointer" onClick={() => navigate(Page.Setting)} />
          </div>
          <H5 className="mt-[15px] mb-[10px] text-navy-500 text-center">{t('appName')}</H5>
          <div>
            <img src={PicBookHero} className="w-full" />
          </div>
          <H2 className="mt-[30px] mb-5 mx-[25px]">{t('bookList.bookList')}</H2>
          {books?.length === 0 ? (
            <Body className="py-[30px] flex justify-center text-navy-300">
              {t('bookList.noBook')}
            </Body>
          ) : (
            <div className="flex gap-[10px] mx-[25px] flex-wrap">
              {books?.map((v, i) => (
                <div
                  key={v.id}
                  className={classNames(
                    'min-h-[100px] w-[calc(50%-5px)] rounded-[15px] px-[10px] pt-[10px] pb-2 sm:w-[140px] cursor-pointer',
                    {
                      'bg-beige-300': i % 3 === 0,
                      'bg-green-300': i % 3 === 1,
                      'bg-tan-300': i % 3 === 2,
                    },
                  )}
                  onClick={() => navigate(`${Page.Book}/${v.id}`)}
                >
                  <div className="bg-white w-fit h-fit rounded-full mb-[10px]">
                    <img src={IcBook} />
                  </div>
                  <Body className="break-words text-navy-700">{v.name}</Body>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 h-[104px] w-full">
        <div className="mx-auto w-fit">
          <Button className="mt-5 w-64 h-12" onClick={() => setOpen(true)}>
            <div className="flex justify-center">
              <img src={IcAdd} />
              <Body size="l" bold className="text-white">
                {t('bookList.newBook')}
              </Body>
            </div>
          </Button>
        </div>
      </div>
      <ModalNewBook open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default BookList;
