import { createContext, useState } from 'react';

export const MovieContext = createContext();

export function MovieProvider({ children }) {
  const moviesArr = [{"id":1,"Title":"The Shawshank Redemption","Year":"1994","Genre":"Drama","Director":"Frank Darabont","actor":"Morgan Freeman","Actors":[{"name":"Tim Robbins","birthYear":1958,"native":"United States","totalMovies":2},{"name":"Morgan Freeman","birthYear":1937,"native":"United States","totalMovies":2}]},{"id":2,"Title":"The Godfather","Year":"1972","Genre":"Crime","Director":"Francis Ford Coppola","actor":"Al Pacino","Actors":[{"name":"Marlon Brando","birthYear":1924,"native":"United States","totalMovies":1},{"name":"Al Pacino","birthYear":1940,"native":"United States","totalMovies":2}]},{"id":3,"Title":"The Dark Knight","Year":"2008","Genre":"Action","Director":"Christopher Nolan","actor":"Christian Bale","Actors":[{"name":"Christian Bale","birthYear":1974,"native":"United Kingdom","totalMovies":1},{"name":"Heath Ledger","birthYear":1979,"native":"Australia","totalMovies":1}]},{"id":4,"Title":"The Godfather: Part II","Year":"1974","Genre":"Crime","Director":"Francis Ford Coppola","actor":"Al Pacino","Actors":[{"name":"Al Pacino","birthYear":1940,"native":"United States","totalMovies":2},{"name":"Robert De Niro","birthYear":1943,"native":"United States","totalMovies":1}]},{"id":5,"Title":"12 Angry Men","Year":"1957","Genre":"Crime, Drama","Director":"Sidney Lumet","actor":"Henry Fonda","Actors":[{"name":"Henry Fonda","birthYear":1905,"native":"United States","totalMovies":1},{"name":"Lee J. Cobb","birthYear":1911,"native":"United States","totalMovies":1}]}];
  const [movies, setMovies] = useState(moviesArr);

  return <MovieContext.Provider value={{ movies, setMovies }}>{children}</MovieContext.Provider>;
}
