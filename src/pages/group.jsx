import { Helmet } from 'react-helmet-async';

import { GroupView } from 'src/sections/group/view';

// ----------------------------------------------------------------------

export default function GroupPage() {
  return (
    <>
      <Helmet>
        <title> Group | Chitly </title>
      </Helmet>

      <GroupView />
    </>
  );
}
