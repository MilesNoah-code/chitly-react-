import { Helmet } from 'react-helmet-async';

import { ChitAuctionView } from 'src/sections/chitauction/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Chit Auction | Chitly </title>
      </Helmet>

      <ChitAuctionView />
    </>
  );
}
