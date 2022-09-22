import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './constant/Page';
import Book from './page/book/Book';
import Detail from './page/detail/Detail';
import Fill from './page/fill/Fill';
import Setting from './page/setting/Setting';

const AppRoutes = () => (
  <Routes>
    <Route path={Page.Book} element={<Book />} />
    <Route path={`${Page.Book}/:id`} element={<Detail />} />
    <Route path={`${Page.Book}/:id/fill`} element={<Fill />} />
    <Route path={`${Page.Book}/:id/setting`} element={<Setting />} />
    <Route path="/*" element={<Navigate to={Page.Book} />} />
  </Routes>
);

export default AppRoutes;
