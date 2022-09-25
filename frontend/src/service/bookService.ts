import bookEndpoint from 'src/api/bookEndpoint';

export const getBookList = async () => {
  const localBook = localStorage.getItem('book');
  if (localBook === null) return [];

  const localBookArray = JSON.parse(localBook) as { id: string; code: string }[];
  const ids = localBookArray.map((v) => v.id).join();
  const code = localBookArray.map((v) => v.code).join();
  const res = await bookEndpoint.getBook({ ids }, code);

  localStorage.setItem('book', JSON.stringify(res.data.map((v) => ({ id: v.id, code: v.code }))));

  return res.data;
};

export const createBook = async (name: string) => {
  const res = await bookEndpoint.postBook({ name });
  const book = res.data;
  const localBook = localStorage.getItem('book');

  if (localBook === null)
    localStorage.setItem('book', JSON.stringify([{ id: book.id, code: book.code }]));
  else {
    const localBookArray = JSON.parse(localBook) as { id: string; code: string }[];
    localStorage.setItem(
      'book',
      JSON.stringify([...localBookArray, { id: book.id, code: book.code }]),
    );
  }

  return res.data;
};
