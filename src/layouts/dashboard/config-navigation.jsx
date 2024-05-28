import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Member',
    path: '/member',
    icon: icon('ic_user'),
  },
  {
    title: 'Groups',
    path: '/group',
    icon: icon('ic_cart'),
  },
  {
    title: 'Group Members',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'Chit Estimate',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Chit Auction',
    path: '/404',
    icon: icon('ic_disabled'),
  },
  {
    title: 'Chit Receipts',
    path: '/chitreceipt',
    icon: icon('ic_cart'),
  },
  {
    title: 'Chit Payment',
    path: '/chitpayment',
    icon: icon('ic_cart'),
  }
];

export default navConfig;
