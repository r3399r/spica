import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './constant/Page';
import Book from './page/book/Book';
import BookDetail from './page/bookDetail/BookDetail';
import BookSetting from './page/bookSetting/BookSetting';
import Fill from './page/fill/Fill';
import Landing from './page/landing/Landing';
import Share from './page/share/Share';

const AppRoutes = () => (
  <Routes>
    <Route path={Page.Landing} element={<Landing />} />
    <Route path={Page.Book} element={<Book />} />
    <Route path={`${Page.Book}/:id`} element={<BookDetail />} />
    <Route path={`${Page.Book}/:id/fill`} element={<Fill />} />
    <Route path={`${Page.Book}/:id/setting`} element={<BookSetting />} />
    <Route path={`${Page.Share}/:id`} element={<Share />} />
    <Route path="/*" element={<Navigate to={Page.Landing} />} />
  </Routes>
);

export default AppRoutes;
