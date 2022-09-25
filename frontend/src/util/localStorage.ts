export const getLocalBooks = (): { id: string; code: string }[] => {
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
