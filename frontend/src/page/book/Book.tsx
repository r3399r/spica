import { GetBookResponse } from '@y-celestial/spica-service';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Button from 'src/component/Button';
import H2 from 'src/component/typography/H2';
import IcAdd from 'src/image/ic-add.svg';
import IcBook from 'src/image/ic-book.svg';
import PicBookHero from 'src/image/pic-book-hero.svg';
import { getBookList } from 'src/service/bookService';

const Book = () => {
  const [bookList, setBookList] = useState<GetBookResponse>();

  useEffect(() => {
    getBookList().then((res) => setBookList(res));
  }, []);

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-scroll">
        <div>
          <img src={PicBookHero} className="w-full" />
        </div>
        <H2 className="mt-[30px] mb-5 mx-10">帳簿清單</H2>
        <div className="flex gap-[10px] mx-10 flex-wrap">
          {bookList?.map((v, i) => (
            <div
              key={v.id}
              className={classNames(
                'h-[100px] w-[calc(50%-5px)] rounded-[15px] px-[10px] pt-[10px]',
                {
                  ['bg-beige-300']: i % 3 === 0,
                  ['bg-green-300']: i % 3 === 1,
                  ['bg-tan-300']: i % 3 === 2,
                },
              )}
            >
              <div className="bg-white w-fit h-fit rounded-full mb-[10px]">
                <img src={IcBook} />
              </div>
              <div className="text-[14px] leading-normal break-words">{v.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 h-[104px] w-full">
        <div className="mx-auto w-fit">
          <Button className="mt-5 w-64 h-12">
            <div className="flex justify-center">
              <img src={IcAdd} />
              <div>建立新帳簿</div>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Book;
