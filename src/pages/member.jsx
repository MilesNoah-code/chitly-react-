import { Helmet } from 'react-helmet-async';

import { MemberView } from 'src/sections/member/view';

// ----------------------------------------------------------------------

export default function MemberPage() {
  return (
    <>
      <Helmet>
        <title> Member | Chitly </title>
      </Helmet>

      <MemberView />
    </>
  );
}
