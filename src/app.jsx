/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { useEffect } from 'react';
import {MovieProvider} from './context/MoviesContext'

// ----------------------------------------------------------------------

export default function App() {

  useScrollToTop();

  return (
    <MovieProvider>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
    </MovieProvider>
  );
}
