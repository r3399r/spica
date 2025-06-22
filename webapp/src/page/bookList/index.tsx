import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Img from 'src/component/Img';
import ModalDonate from 'src/component/ModalDonate';
import Body from 'src/component/typography/Body';
import H2 from 'src/component/typography/H2';
import H5 from 'src/component/typography/H5';
import { Page } from 'src/constant/Page';
import IcAdd from 'src/image/ic-add.svg';
import IcBook from 'src/image/ic-book.svg';
import IcConfigActive from 'src/image/ic-config-active.svg';
import IcConfig from 'src/image/ic-config.svg';
import IcSync from 'src/image/ic-sync.svg';
import PicBookHero from 'src/image/pic-book-hero.svg';
import { RootState } from 'src/redux/store';
import { setTxPageScroll } from 'src/redux/uiSlice';
import { loadBookList } from 'src/service/bookService';
import ModalNewBook from './ModalNewBook';

const BookList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    book: { books },
    ui: { isDeviceReady },
  } = useSelector((rootState: RootState) => rootState);
  const [openNewBook, setOpenNewBook] = useState<boolean>(false);
  const [openDonate, setOpenDonate] = useState<boolean>(false);

  useEffect(() => {
    dispatch(setTxPageScroll(0));
  }, []);

  useEffect(() => {
    if (isDeviceReady) loadBookList();
  }, [isDeviceReady]);

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="mx-[15px] max-w-[640px] sm:mx-auto">
          <div className="flex items-center justify-between">
            <Img
              src={IcSync}
              className="cursor-pointer"
              onClick={() => navigate(`${Page.Setting}/sync`)}
            />
            <H5 className="mb-[10px] mt-[15px] text-center text-navy-500">{t('appName')}</H5>
            <Img
              src={IcConfig}
              srcActive={IcConfigActive}
              className="cursor-pointer"
              onClick={() => navigate(Page.Setting)}
            />
          </div>
          <div className="relative cursor-pointer" onClick={() => setOpenDonate(true)}>
            <img src={PicBookHero} className="w-full" />
            <Body
              size="s"
              className="absolute right-[4.9%] top-[81.1%] flex h-[16.8%] items-center justify-end text-[#b0784e]"
            >
              {t('bookList.donate')}
            </Body>
          </div>
          <H2 className="mx-[25px] mb-5 mt-[30px]">{t('bookList.bookList')}</H2>
          {books?.length === 0 ? (
            <Body className="flex justify-center py-[30px] text-navy-300">
              {t('bookList.noBook')}
            </Body>
          ) : (
            <div className="mx-[25px] flex flex-wrap gap-[10px]">
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
                  <div className="mb-[10px] h-fit w-fit rounded-full bg-white">
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
          <Button className="mt-5 h-12 w-64" onClick={() => setOpenNewBook(true)}>
            <div className="flex justify-center">
              <img src={IcAdd} />
              <Body size="l" bold className="text-white">
                {t('bookList.newBook')}
              </Body>
            </div>
          </Button>
        </div>
      </div>
      <ModalNewBook open={openNewBook} handleClose={() => setOpenNewBook(false)} />
      <ModalDonate open={openDonate} handleClose={() => setOpenDonate(false)} />
    </>
  );
};

export default BookList;
