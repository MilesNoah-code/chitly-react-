import { lazy, Suspense } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

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
  const routes = useRoutes([
    {
      element: <LoginPage />,
      index: true
    },
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'dashboard', element: <IndexPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'member', element: <MemberPage /> },
        { path: 'addMember', element: <MemberAddPage /> },
        { path: 'addMember', element: <MemberAddPage /> },
        { path: 'groupMember', element:<groupMember/>},
        { path: 'group', element: <GroupPage /> },
        { path: 'addGroup', element: <GroupAddPage /> },
        { path: 'chitreceipt', element: <ChitReceiptPage /> },
        { path: 'addChitReceipt', element: <ChitReceiptAddPage /> },
        { path: 'chitpayment', element: <ChitPaymentPage /> },
        { path: 'addChitPayment', element: <ChitPaymentAddPage /> },
      ],
    },{
      element: <LoginPage />,
      path: 'login',
      index: true
    },
  ]);

  return routes;
}
