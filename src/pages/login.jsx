import { Helmet } from 'react-helmet-async';

import { Login } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | Chitly </title>
      </Helmet>

      <Login />
    </>
  );
}
