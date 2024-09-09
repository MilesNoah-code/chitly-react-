import React, { useState, useEffect,useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Button, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';
import {MovieContext} from '../../context/MoviesContext'

export default function MovieEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [genere, setGenere] = useState('');
  const [director, setDirector] = useState('');
  const [actor, setActors] = useState([]);
  const [curActor, setCurActor] = useState('');
  const [item, setItem] = useState(null);
  const [movies, setMovies] = useState([]);
  const [errors, setErrors] = useState({
    name: '',
    year: '',
    genere: '',
    director: '',
    actors: [],
  });
  const [curScreen, setCurScreen] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const {movieArr, setMovieArr} = useContext(MovieContext)
  console.log(movieArr, "edit")


  useEffect(() => {
    const moviesArr = JSON.parse(localStorage.getItem('movies')) || [];
    setMovies(moviesArr);
  }, []);

  const goBack = () => {
    navigate('/movies');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', year: '', genre: '', director: '', actors: [] };

    if (!name.trim()) {
      newErrors.name = 'Title is required';
      isValid = false;
    }
    if (!year || Number.isNaN(year)) {
      newErrors.year = 'Valid year is required';
      isValid = false;
    }
    if (!genere.trim()) {
      newErrors.genre = 'Genre is required';
      isValid = false;
    }
    if (!director.trim()) {
      newErrors.director = 'Director is required';
      isValid = false;
    }

    const actorErrors = actor.map((a, index) => {
      const actorError = { name: '', birthYear: '', native: '' };
      if (!a.name.trim()) {
        actorError.name = 'Actor name is required';
        isValid = false;
      }
      if (!a.birthYear || Number.isNaN(a.birthYear)) {
        actorError.birthYear = 'Valid birth year is required';
        isValid = false;
      }
      if (!a.totalMovies || Number.isNaN(a.totalMovies) ) {
        actorError.totalMovies = 'Valid birth year is required';
        isValid = false;
      }

      return actorError;
    });
    newErrors.actors = actorErrors;

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = (from = '') => {
    if (!validateForm()) {
      return;
    }
    setErrors({ name: '', year: '', genre: '', director: '', actors: [] });
    if (from !== 'actor') {
      const currentId = item ? item.id : movies.length + 1;
      const curItem = {
        id: currentId,
        Title: name,
        Year: year,
        Genre: genere,
        actor: curActor,
        Director: director,
        Actors: actor,
      };

      if (curScreen === 'edit') {
        const index = movies.findIndex((movie) => movie.id === item.id);
        movies[index] = curItem;
      } else {
        movies.push(curItem);
      }

      localStorage.setItem('movies', JSON.stringify(movies));
      setMovies(movies);
      navigate('/movies');
    }
  };

  useEffect(() => {
    const { screen, data } = location.state || {};
    setCurScreen(screen);
    setItem(data || null);
    if (data) {
      setName(data.Title);
      setYear(data.Year);
      setGenere(data.Genre);
      setDirector(data.Director);
      setCurActor(data.actor);
      setActors(data.Actors || []);
    }
  }, [location.state]);

  useEffect(() => {
    isActorFill();
  }, [actor]);

  const isActorFill = () => {
    if (actor.length < 5) {
      setDisableButton(false);
      return true;
    } 
      setDisableButton(true);
      return false;
    
  };

  const safeParse = (val) => {
    const value = parseInt(val, 10);
    return Number.isNaN(value) ? 0 : value;
  };

  const setActorMax = (newArray) => {
    if (newArray.length === 0) return;

    let curItem = newArray[0];

    newArray.forEach((item) => {
      const currentTotalMovies = safeParse(item.totalMovies);
      const currentCurItemMovies = safeParse(curItem.totalMovies);

      if (currentTotalMovies > currentCurItemMovies) {
        curItem = item;
      }
    });

    setCurActor(curItem.name);
  };

  const handleChageActors = (index, field, value) => {
    const newArray = [...actor];
    newArray[index] = { ...newArray[index], [field]: value };
    setActors(newArray);
    setErrors((prevErrors) => {
      const newActorErrors = [...prevErrors.actors];
      newActorErrors[index] = { ...newActorErrors[index], [field]: '' };
      return { ...prevErrors, actors: newActorErrors };
    });
    if (field === 'totalMovies') {
      setActorMax(newArray);
    }
    if (field === 'native') {
      onSubmit('actor');
    }
  };

  const addActor = () => {
    if (!isActorFill()) {
      return;
    }
    const newActor = {
      name: '',
      birthYear: '',
      native: '',
    };
    setActors([...actor, newActor]);
  };

  const handleFormChange = (fun, value, field) => {
    fun(value);
    console.log('We are working on it');
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }));
  };

  const handleDeleteActor = (index) => {
    const newArr = actor.filter((_, i) => i !== index);
    setActors(newArr);
    setActorMax(newArr);
  };

  return (
    <Stack
      spacing={2}
      sx={{
        width: '90%',
        ml: 'auto',
        mr: 'auto',
        mt: '100px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        background: 'white',
        padding: '30px 50px',
        borderRadius: '7px',
      }}
    >
      <Stack spacing={4}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Typography align="left" sx={{ fontSize: '25px', mb: '10px', fontWeight: 'bold' }}>
            {curScreen === 'add' ? 'Add Movie' : 'Edit Movie'}
          </Typography>
          <Button variant="contained" onClick={goBack}>
            {' '}
            Back{' '}
          </Button>
        </Stack>
        <Stack direction="row" spacing="50px" width="100%">
          <TextField
            label="Title"
            id="movie-title"
            value={name}
            onChange={(e) => handleFormChange(setName, e.target.value, 'name')}
            size="small"
            error={!!errors.name}
            // helperText={errors.name}
            sx={{ width: '50%' }}
          />
          <TextField
            label="Year"
            id="movie-year"
            value={year}
            error={!!errors.year}
            // helperText={errors.year}
            onChange={(e) => handleFormChange(setYear, e.target.value, 'year')}
            size="small"
            sx={{ width: '50%' }}
          />
        </Stack>
        <Stack direction="row" spacing="50px" width="100%">
          <TextField
            label="Genre"
            id="movie-genre"
            value={genere}
            onChange={(e) => handleFormChange(setGenere, e.target.value, 'genre')}
            size="small"
            sx={{ width: '50%' }}
            error={!!errors.genre}
            // helperText={errors.genre}
          />
          <TextField
            label="Director"
            id="movie-director"
            value={director}
            onChange={(e) => handleFormChange(setDirector, e.target.value, 'director')}
            size="small"
            sx={{ width: '50%' }}
            error={!!errors.director}
            // helperText={errors.director}
          />
        </Stack>
        <Stack direction="row" spacing="50px" width="100%">
          <TextField
            label="Actor"
            id="movie-actor"
            value={curActor}
            onChange={(e) => handleFormChange(setGenere, e.target.value, 'actor')}
            size="small"
            sx={{ width: '47.9%' }}
            disabled="true"
            // helperText={errors.genre}
          />
        </Stack>
        {actor.length > 0 && (
          <Stack direction="row" spacing="50px" width="100%">
            <Stack spacing={4}>
              <Typography align="left" sx={{ fontSize: '18px', mb: '10px', fontWeight: 'bold' }}>
                Actors
              </Typography>
              {actor.map((element, index) => (
                <Stack direction="row" spacing="50px" width="100%">
                  <TextField
                    label="Name"
                    id={`actor-name-${index}`}
                    value={element.name}
                    onChange={(e) => handleChageActors(index, 'name', e.target.value)}
                    size="small"
                    sx={{ width: '50%' }}
                    error={!!errors.actors[index]?.name}
                    // helperText={errors.actors[index]?.name}
                  />
                  <TextField
                    label="Birth Year"
                    id={`actor-birth-year-${index}`}
                    value={element.birthYear}
                    onChange={(e) => handleChageActors(index, 'birthYear', e.target.value)}
                    size="small"
                    error={!!errors.actors[index]?.birthYear}
                    // helperText={errors.actors[index]?.birthYear}
                    sx={{ width: '50%' }}
                  />

                  <TextField
                    label="Total Movies"
                    id={`actor-native-${index}`}
                    value={element.totalMovies}
                    onChange={(e) => handleChageActors(index, 'totalMovies', e.target.value)}
                    size="small"
                    sx={{ width: '50%' }}
                    error={!!errors.actors[index]?.totalMovies}
                  />
                  <TextField
                    label="Native"
                    id={`actor-native-${index}`}
                    value={element.native}
                    onChange={(e) => handleChageActors(index, 'native', e.target.value)}
                    size="small"
                    sx={{ width: '50%' }}
                  />

                  <Iconify
                    icon="eva:trash-2-outline"
                    sx={{
                      mr: 2,
                      width: '40px !important',
                      height: '40px !important',
                      cursor: 'pointer',
                      transition: 'color 0.3s',
                      color: 'red',
                    }}
                    onClick={() => handleDeleteActor(index)}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
        <Stack direction="row" spacing={2}>
          <Button disabled={disableButton} variant="contained" onClick={addActor}>
            {' '}
            Add Actor{' '}
          </Button>
          <Button variant="contained" onClick={() => onSubmit()}>
            {' '}
            Submit{' '}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
