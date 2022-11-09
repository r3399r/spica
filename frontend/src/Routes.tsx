import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './constant/Page';
import BookDetail from './page/bookDetail';
import BookList from './page/bookList';
import BookSetting from './page/bookSetting';
import Fill from './page/fill/Fill';
import Landing from './page/landing/Landing';
import Member from './page/member';
import Share from './page/share';
import Transaction from './page/transaction';

const AppRoutes = () => (
  <Routes>
    <Route path={Page.Landing} element={<Landing />} />
    <Route path={Page.Book} element={<BookList />} />
    <Route path={`${Page.Book}/:id`} element={<BookDetail />} />
    <Route path={`${Page.Book}/:id/tx/:tid`} element={<Transaction />} />
    <Route path={`${Page.Book}/:id/member`} element={<Member />} />
    <Route path={`${Page.Book}/:id/fill`} element={<Fill />} />
    <Route path={`${Page.Book}/:id/setting`} element={<BookSetting />} />
    <Route path={`${Page.Share}/:id`} element={<Share />} />
    <Route path="/*" element={<Navigate to={Page.Landing} />} />
  </Routes>
);

export default AppRoutes;
