import { Helmet } from 'react-helmet-async';

import { ActivityLogView } from 'src/sections/activitylog/view';

// ----------------------------------------------------------------------

export default function ChitAuctionPage() {
  return (
    <>
      <Helmet>
        <title> Activity Log | Chitly </title>
      </Helmet>

      <ActivityLogView />
    </>
  );
}
