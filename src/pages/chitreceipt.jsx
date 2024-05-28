import { Helmet } from 'react-helmet-async';

import { ChitReceiptView } from 'src/sections/chitreceipt/view';

// ----------------------------------------------------------------------

export default function ChitReceiptPage() {
  return (
    <>
      <Helmet>
        <title> Chit Receipt | Minimal UI </title>
      </Helmet>

      <ChitReceiptView />
    </>
  );
}
