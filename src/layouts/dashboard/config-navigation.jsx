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
    subItems: [
      {
        path: '/member/add',
        title: 'Add Member'
      },
      {
        path: 'member/view/:memberId',
        title: 'View Member'
      },
      {
        path: 'member/edit/:memberId',
        title: 'Edit Member'
      }
    ]
  },
  {
    title: 'Groups',
    path: '/group/list',
    icon: icon('group'),
    subItems: [
      {
        path: 'group/add',
        title: 'Add Group'
      },
      {
        path: 'group/view/:groupId',
        title: 'View Group'
      },
      {
        path: 'group/edit/:groupId',
        title: 'Edit Group'
      }
    ]
  },
  {
    title: 'Group Members',
    path: '/groupMember/list',
    icon: icon('groupmember'),
    subItems: [
      {
        path: 'groupMember',
        title: 'Group Member'
      }
    ]
  },
  {
    title: 'Chit Estimate',
    path: '/chitestimate/list',
    icon: icon('chitestimate'),
    subItems: [
      {
        path: 'chitestimate/add',
        title: 'Add Chit Estimate'
      }
    ]
  },
  {
    title: 'Chit Auction',
    path: '/chitauction/list',
    icon: icon('chitauction'),
    subItems: [
      {
        path: 'chitauction/add',
        title: 'Add Chit Auction'
      }
    ]
  },
  {
    title: 'Chit Receipts',
    path: '/chitreceipt/list',
    icon: icon('chitreceipt'),
    subItems: [
      {
        path: 'chitreceipt/add',
        title: 'Add Chit Receipt'
      },
      {
        path: 'chitreceipt/view/:receiptId',
        title: 'View Chit Receipt'
      }
    ]
  },
  {
    title: 'Chit Payment',
    path: '/chitpayment/list',
    icon: icon('chitpayment'),
    subItems: [
      {
        path: 'chitpayment/add',
        title: 'Add Chit Payment'
      },
      {
        path: 'chitpayment/view/:paymentId',
        title: 'View Chit Payment'
      }
    ]
  },
  {
    title: 'Reports',
    path: '/report/list',
    icon: icon('report'),
  },
  {
    title: 'Activity Log',
    path: '/ActivityLog/list',
    icon: icon('activity_log'),
  }
];

export default navConfig;
