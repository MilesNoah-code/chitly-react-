import { Helmet } from 'react-helmet-async';

import { MemberView } from 'src/sections/member/view';

// ----------------------------------------------------------------------

export default function MemberPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <MemberView />
    </>
  );
}
