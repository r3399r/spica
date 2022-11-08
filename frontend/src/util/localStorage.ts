import { LocalBook } from 'src/model/Book';

export const getLocalBooks = (): LocalBook[] => {
  const local = localStorage.getItem('book');

  if (local === null) return [];

  try {
    if (Array.isArray(JSON.parse(local))) return JSON.parse(local);
    throw new Error();
  } catch {
    localStorage.removeItem('book');

    return [];
  }
};

export const getLocalBookById = (id: string): LocalBook | undefined => {
  const localBooks = getLocalBooks();

  return localBooks.find((v) => v.id === id);
};

export const setShowDeleted = (id: string, showDeleted: boolean) => {
  const localBooks = getLocalBooks();
  const idx = localBooks.findIndex((v) => v.id === id);
  if (idx >= 0) {
    const tmp = [...localBooks];
    tmp[idx] = { ...tmp[idx], showDeleted };
    localStorage.setItem('book', JSON.stringify(tmp));
  }
};
