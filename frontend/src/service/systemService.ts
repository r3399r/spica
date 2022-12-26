import { Language } from 'src/constant/Language';

export const getLanguageName = (code: string) =>
  Language.find((v) => v.code === code)?.name ?? 'English';
