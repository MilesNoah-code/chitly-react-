import { Helmet } from 'react-helmet-async';

import  Movie  from 'src/sections/Movies/movies'



export default function MoviePage() {
  return (
    <>
      <Helmet>
        <title> Movies | Chitly </title>
      </Helmet>

      <Movie />
    </>
  );
}
