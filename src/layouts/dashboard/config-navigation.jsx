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
    path: '/member/list',
    icon: icon('member'),
  },
  {
    title: 'Groups',
    path: '/group/list',
    icon: icon('group'),
  },
  {
    title: 'Group Members',
    path: '/groupMember/list',
    icon: icon('groupmember'),
  },
  {
    title: 'Chit Estimate',
    path: '/chitestimate/list',
    icon: icon('chitestimate'),
  },
  {
    title: 'Chit Auction',
    path: '/chitauction/list',
    icon: icon('chitauction'),
  },
  {
    title: 'Chit Receipts',
    path: '/chitreceipt/list',
    icon: icon('chitreceipt'),
  },
  {
    title: 'Chit Payment',
    path: '/chitpayment/list',
    icon: icon('chitpayment'),
  }
];

export default navConfig;
