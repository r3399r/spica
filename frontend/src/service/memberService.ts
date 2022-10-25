import bookEndpoint from 'src/api/bookEndpoint';
import { setBooks } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getLocalBooks } from 'src/util/localStorage';

export const addMember = async (id: string, nickname: string) => {
  try {
    dispatch(startWaiting());

    const localBooks = getLocalBooks();
    const code = localBooks.find((v) => id === v.id)?.code ?? 'xx';
    const res = await bookEndpoint.postBookIdMember(id, { nickname }, code);

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) => {
      if (v.id === id)
        return {
          ...v,
          members: [...(v.members ?? []), res.data],
        };

      return v;
    });

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};

export const renameMember = async (bookId: string, memberId: string, nickname: string) => {
  try {
    dispatch(startWaiting());

    const localBooks = getLocalBooks();
    const code = localBooks.find((v) => bookId === v.id)?.code ?? 'xx';
    const res = await bookEndpoint.putBookIdName(bookId, memberId, { nickname }, code);

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) => {
      if (v.id === bookId) {
        const updatedMembers = (v.members ?? []).map((o) => (o.id === memberId ? res.data : o));

        return {
          ...v,
          members: updatedMembers,
        };
      }

      return v;
    });

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};

export const deleteMember = async (bookId: string, memberId: string) => {
  try {
    dispatch(startWaiting());

    const localBooks = getLocalBooks();
    const code = localBooks.find((v) => bookId === v.id)?.code ?? 'xx';
    await bookEndpoint.deleteBookIdMember(bookId, memberId, code);

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) => {
      if (v.id === bookId) {
        const updatedMembers = (v.members ?? []).filter((o) => o.id !== memberId);

        return {
          ...v,
          members: updatedMembers,
        };
      }

      return v;
    });

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};
