import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './constant/Page';
import Add2HomeScreen from './page/add2HomeScreen';
import BookDetail from './page/bookDetail';
import BookList from './page/bookList';
import BookSetting from './page/bookSetting';
import EidtTransaction from './page/editTransaction';
import Landing from './page/landing';
import Member from './page/member';
import PersonalBalance from './page/personalBalance';
import Settlement from './page/settlement';
import Share from './page/share';
import SystemSetting from './page/systemSetting';
import Transaction from './page/transaction';
import Transfer from './page/transfer';

const AppRoutes = () => (
  <Routes>
    <Route path={Page.Landing} element={<Landing />} />
    <Route path={Page.Book} element={<BookList />} />
    <Route path={Page.Setting} element={<SystemSetting />} />
    <Route path={`${Page.Setting}/transfer`} element={<Transfer />} />
    <Route path={`${Page.Setting}/a2hs`} element={<Add2HomeScreen />} />
    <Route path={`${Page.Book}/:id`} element={<BookDetail />} />
    <Route path={`${Page.Book}/:id/tx`} element={<EidtTransaction />} />
    <Route path={`${Page.Book}/:id/tx/:tid`} element={<Transaction />} />
    <Route path={`${Page.Book}/:id/member`} element={<Member />} />
    <Route path={`${Page.Book}/:id/setting`} element={<BookSetting />} />
    <Route path={`${Page.Book}/:id/settlement`} element={<Settlement />} />
    <Route path={`${Page.Book}/:id/settlement/:uid`} element={<PersonalBalance />} />
    <Route path={`${Page.Share}/:id`} element={<Share />} />
    <Route path="/*" element={<Navigate to={Page.Book} />} />
  </Routes>
);

export default AppRoutes;
