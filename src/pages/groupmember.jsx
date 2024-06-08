import { Helmet } from 'react-helmet-async';

import { GroupMemberView } from 'src/sections/groupmember/view';

// ----------------------------------------------------------------------

export default function GroupMemberPage() {
  return (
    <>
      <Helmet>
        <title> Group Member | Chitly </title>
      </Helmet>

      <GroupMemberView />
    </>
  );
}
