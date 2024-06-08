import { Helmet } from 'react-helmet-async';

import { ChitEstimateView } from 'src/sections/chitestimate/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Chit Estimate | Chitly </title>
      </Helmet>

      <ChitEstimateView />
    </>
  );
}
