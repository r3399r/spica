import { GetBookResponse } from '@y-celestial/spica-service';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Input from 'src/component/Input';
import ModalVanilla from 'src/component/ModalVanilla';
import H2 from 'src/component/typography/H2';
import { Page } from 'src/constant/Page';
import IcAdd from 'src/image/ic-add.svg';
import IcBook from 'src/image/ic-book.svg';
import PicBookHero from 'src/image/pic-book-hero.svg';
import { getBookList } from 'src/service/bookService';

const Book = () => {
  const navigate = useNavigate();
  const [bookList, setBookList] = useState<GetBookResponse>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    getBookList().then((res) => setBookList(res));
  }, []);

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-scroll">
        <div>
          <img src={PicBookHero} className="w-full" />
        </div>
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <H2 className="mt-[30px] mb-5 mx-[25px]">帳簿清單</H2>
          <div className="flex gap-[10px] mx-[25px] flex-wrap">
            {bookList?.map((v, i) => (
              <div
                key={v.id}
                className={classNames(
                  'min-h-[100px] w-[calc(50%-5px)] rounded-[15px] px-[10px] pt-[10px] pb-2 sm:w-[140px] cursor-pointer',
                  {
                    ['bg-beige-300']: i % 3 === 0,
                    ['bg-green-300']: i % 3 === 1,
                    ['bg-tan-300']: i % 3 === 2,
                  },
                )}
                onClick={() => navigate(`${Page.Book}/${v.id}`)}
              >
                <div className="bg-white w-fit h-fit rounded-full mb-[10px]">
                  <img src={IcBook} />
                </div>
                <div className="text-[14px] leading-normal break-words">{v.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 h-[104px] w-full">
        <div className="mx-auto w-fit">
          <Button className="mt-5 w-64 h-12" onClick={() => setOpen(true)}>
            <div className="flex justify-center">
              <img src={IcAdd} />
              <div>建立新帳簿</div>
            </div>
          </Button>
        </div>
      </div>
      <ModalVanilla
        open={open}
        handleClose={() => setOpen(false)}
        title="建立新帳簿"
        leftBtn="取消"
        rightBtn="送出"
      >
        <div>
          <Input placeholder="帳簿名稱 （最多15字）" />
        </div>
      </ModalVanilla>
    </>
  );
};

export default Book;
