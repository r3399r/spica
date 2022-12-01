import { createContext, ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

type HistoryContextType = { stack: string[] };

export const HistoryContext = createContext<HistoryContextType>({ stack: [] });

type Props = { children: ReactNode };

export const HistoryProvider = ({ children }: Props) => {
  const [stack, setStack] = useState<string[]>([]);
  const { pathname } = useLocation();
  const type = useNavigationType();

  useEffect(() => {
    if (type === 'POP') setStack(stack.slice(0, stack.length - 1));
    else if (type === 'PUSH') setStack([...stack, pathname]);
    else setStack([...stack.slice(0, stack.length - 1), pathname]);
  }, [pathname, type]);

  return <HistoryContext.Provider value={{ stack }}>{children}</HistoryContext.Provider>;
};
