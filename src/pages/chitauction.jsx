import { Helmet } from 'react-helmet-async';

import { ChitAuctionView } from 'src/sections/chitauction/view';

// ----------------------------------------------------------------------

export default function ChitAuctionPage() {
  return (
    <>
      <Helmet>
        <title> Chit Auction | Chitly </title>
      </Helmet>

      <ChitAuctionView />
    </>
  );
}
