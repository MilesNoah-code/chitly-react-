import { Helmet } from 'react-helmet-async';

import { ChitPaymentView } from 'src/sections/chitpayment/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Chit Payment | Chitly </title>
      </Helmet>

      <ChitPaymentView />
    </>
  );
}
