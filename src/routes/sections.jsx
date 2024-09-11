import React, { lazy, Suspense } from 'react';
import { Route, Routes, Outlet, Navigate } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

const IndexPage = lazy(() => import('src/pages/app'));
const LoginPage = lazy(() => import('src/pages/login'));
const MemberPage = lazy(() => import('src/pages/member'));
const MemberAddPage = lazy(() => import('src/sections/member/member-add'));
const GroupPage = lazy(() => import('src/pages/group'));
const GroupAddPage = lazy(() => import('src/sections/group/group-add'));
const ChitReceiptPage = lazy(() => import('src/pages/chitreceipt'));
const ChitReceiptAddPage = lazy(() => import('src/sections/chitreceipt/chitreceipt-add'));
const ChitPaymentPage = lazy(() => import('src/pages/chitpayment'));
const ChitPaymentAddPage = lazy(() => import('src/sections/chitpayment/chitpayment-add'));
const GroupMemberPage = lazy(() => import('src/pages/groupmember'));
const Page404 = lazy(() => import('src/pages/page-not-found'));
const ChangeLog = lazy(() => import('src/changelog'));
const ChitEstimatePage = lazy(() => import('src/pages/chitestimate'));
const ChitEstimateAddPage = lazy(() => import('src/sections/chitestimate/chitestimate-add'));
const ChitAuctionPage = lazy(() => import('src/pages/chitauction'));
const ChitAuctionAddPage = lazy(() => import('src/sections/chitauction/chitauction-add'));
const ActivityLogPage = lazy(() => import('src/pages/activitylog'));
const GroupMemberAddPage = lazy(() => import('src/sections/groupmember/groupmember-add'));
const ReportPage = lazy(() => import('src/pages/report'));
const MoviePage = lazy(()=>import('src/pages/movies'))
const MovieViewPage = lazy(()=>import('src/sections/Movies/movies-view'))
const MovieEditPage = lazy(()=>import('src/sections/Movies/movies-edit'))

function Router() {
  const isSessionAvailable = localStorage.getItem('apiToken') !== null;

  return (
    <Routes>
      <Route
        path="/"
        element={isSessionAvailable ? (
          <DashboardLayout>
            <Suspense fallback={  <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              // position: 'fixed',
              // top: '20%',
              // left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.8)',
            
            }}>
              <img className='load' src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70 }} />
            </div>
          }>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        ) : (
          <Navigate to="login" replace />
        )}
      >
        <Route index element={<IndexPage />} />
        <Route path="dashboard" element={<IndexPage />} />
        <Route path="member/list" element={<MemberPage />} />
        <Route path="member/add" element={<MemberAddPage />} />
        <Route path="member/view/:memberId" element={<MemberAddPage />} />
        <Route path="member/edit/:memberId" element={<MemberAddPage />} />
        <Route path="groupMember/list" element={<GroupMemberPage />} />
        <Route path="groupMember" element={<GroupMemberAddPage />} />
        <Route path="group/list" element={<GroupPage />} />
        <Route path="group/add" element={<GroupAddPage />} />
        <Route path="group/view/:groupId" element={<GroupAddPage />} />
        <Route path="group/edit/:groupId" element={<GroupAddPage />} />
        <Route path="chitreceipt/list" element={<ChitReceiptPage />} />
        <Route path="chitreceipt/add" element={<ChitReceiptAddPage />} />
        <Route path="chitreceipt/view/:receiptId" element={<ChitReceiptAddPage />} />
        <Route path="chitpayment/list" element={<ChitPaymentPage />} />
        <Route path="chitpayment/add" element={<ChitPaymentAddPage />} />
        <Route path="chitpayment/view/:paymentId" element={<ChitPaymentAddPage />} />
        <Route path="chitestimate/list" element={<ChitEstimatePage />} />
        <Route path="chitestimate/add" element={<ChitEstimateAddPage />} />
        <Route path="chitauction/list" element={<ChitAuctionPage />} />
        <Route path="chitauction/add" element={<ChitAuctionAddPage />} />
        <Route path="report/list" element={<ReportPage />} />
        <Route path="ActivityLog/list" element={<ActivityLogPage />} />
        <Route path="movies" element={<MoviePage />}/>
        <Route path="movies/add" element={<MovieEditPage />}/>
        <Route path="movies/view/:movieId" element={<MovieViewPage />}/>
        <Route path="movies/edit/:movieId?" element={<MovieEditPage />}/>
      </Route>

      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<Page404 />} />
      <Route path="changelog" element={<ChangeLog />} />
    </Routes>
  );
}

export default Router;
