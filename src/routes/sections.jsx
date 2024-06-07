import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const MemberPage = lazy(() => import('src/pages/member'));
export const MemberAddPage = lazy(() => import('src/sections/member/member-add'));
export const GroupPage = lazy(() => import('src/pages/group'));
export const GroupAddPage = lazy(() => import('src/sections/group/group-add'));
export const ChitReceiptPage = lazy(() => import('src/pages/chitreceipt'));
export const ChitReceiptAddPage = lazy(() => import('src/sections/chitreceipt/chitreceipt-add'));
export const ChitPaymentPage = lazy(() => import('src/pages/chitpayment'));
export const ChitPaymentAddPage = lazy(() => import('src/sections/chitpayment/chitpayment-add'));
export const groupMember = lazy(() => import('src/sections/blog/group-member'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const isSessionAvailable = localStorage.getItem('apiToken') !== null;

  const routes = useRoutes([
    {
      path: '/',
      element: isSessionAvailable ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { path: '', element: <IndexPage /> },
        { path: 'dashboard', element: <IndexPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'member/list', element: <MemberPage /> },
        { path: 'member/add', element: <MemberAddPage /> },
        { path: 'member/view/:memberId', element: <MemberAddPage /> },
        { path: 'member/edit/:memberId', element: <MemberAddPage /> },
        { path: 'groupMember', element:<groupMember/>},
        { path: 'groupMember', element: <groupMember /> },
        { path: 'group/list', element: <GroupPage /> },
        { path: 'group/add', element: <GroupAddPage /> },
        { path: 'group/view/:memberId', element: <GroupAddPage /> },
        { path: 'group/edit/:memberId', element: <GroupAddPage /> },
        { path: 'chitreceipt/list', element: <ChitReceiptPage /> },
        { path: 'chitreceipt/add', element: <ChitReceiptAddPage /> },
        { path: 'chitreceipt/view/:memberId', element: <ChitReceiptAddPage /> },
        { path: 'chitpayment/list', element: <ChitPaymentPage /> },
        { path: 'chitpayment/add', element: <ChitPaymentAddPage /> },
        { path: 'chitpayment/view/:memberId', element: <ChitPaymentAddPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '*',
      element: <Page404 />,
    },
  ]);

  return routes;
}