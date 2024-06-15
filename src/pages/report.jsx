import { Helmet } from 'react-helmet-async';

import { ReportView } from 'src/sections/report/view';

// ----------------------------------------------------------------------

export default function MemberPage() {
  return (
    <>
      <Helmet>
        <title> Report | Chitly </title>
      </Helmet>

      <ReportView />
    </>
  );
}
