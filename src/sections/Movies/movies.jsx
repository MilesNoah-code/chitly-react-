import React, { useState, useEffect, useContext } from 'react';
import { Typography, Button, Snackbar, Alert, TextField, Popover, MenuItem } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import './movies-styles.css';
import {MovieContext} from '../../context/MoviesContext'


export default function Movie() {
  const [alert, setAlert] = useState(false);
  const [movies, setMovies] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(null);
  const [selectItem, setSelectItem] = useState({});
  const [isdelete, setIsDelete] = useState(true);
  const {contextMovies, setContextMovies} = useContext(MovieContext);
   
  const navigate = useNavigate();

  useEffect(() => {
    const moviesArr = contextMovies || [];
    setMovies(moviesArr);
  }, []);

  const StyledRow = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: 'edf4fe',
      color: '#1877f2',
    },
  }));

  const handleClick = (action, item) => {
    if (action === 'edit') {
      navigate(`/movies/edit/${item.id}`, {
        state: {
          screen: 'edit',
          data: item,
        },
      });
    } else if (action === 'view') {
      navigate(`/movies/view/${item.id}`, {
        state: {
          screen: 'view',
          data: item,
        },
      });
    } else if (action === 'add') {
      navigate(`/movies/add`, {
        state: {
          screen: 'add',
        },
      });
    } else if (action === 'delete') {
      const newMovies = movies.filter((data) => data.id !== item.id);
     
      setMovies(newMovies);
      setMessage('Movie Has Been Deleted');
      setIsSuccess(true);
      setAlert(true);
    }
  };
  const handleAlertClose = () => {
    setMessage('');
    setIsSuccess(false);
    setAlert(false);
  };
  const filterByName = (text) => {
    const curText = text || '';
    if (curText.length > 0) {
      const newArr = contextMovies.filter((item) =>
        item.Title.toLowerCase().includes(curText.toLowerCase())
      );
      setMovies(newArr);
    } else {
      setMovies(contextMovies);
    }
  };
  const handleOpenMenu = (item, event) => {
    setSelectItem(item);
    setOpen(event.currentTarget);
  };

  const HandleSelectMenu = () => {
    setOpen(null);
  };

  return (
    <Stack
      sx={{
        width: '80%',
        ml: 'auto',
        mr: 'auto',
        mt: '100px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        background: 'white',
        padding: '30px',
        borderRadius: '7px',
      }}
    >
      <Typography align="left" sx={{ fontSize: '25px', mb: '10px', fontWeight: 'bold' }}>
        {' '}
        Movies{' '}
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        mb="20px"
        alignItems="center"
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            onChange={(e) => filterByName(e.target.value)}
            className="search-tect-field-movie"
            size="small"
          />
        </Stack>
        <Button variant="contained" onClick={() => handleClick('add')}>
          {' '}
          Add Movie{' '}
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <StyledRow sx={{ fontSize: '0.855rem !important' }}>Name</StyledRow>
              <StyledRow sx={{ fontSize: '0.855rem !important' }}>Year</StyledRow>
              <StyledRow sx={{ fontSize: '0.855rem !important' }}>Genere</StyledRow>
              <StyledRow sx={{ fontSize: '0.855rem !important' }}>Director</StyledRow>
              <StyledRow sx={{ fontSize: '0.855rem !important' }}>Actor</StyledRow>
              <StyledRow sx={{ fontSize: '0.855rem !important' }}>Actions</StyledRow>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((item) => (
              <>
                <TableRow key={item.id} sx={{ '& > *': { marginTop: '7px', marginBottom: '7px' } }}>
                  <TableCell sx={{ fontSize: '0.855rem !important' }}>
                    <Typography sx={{ fontSize: '0.855rem !important' }}>{item.Title}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.855rem !important' }}>{item.Year}</TableCell>
                  <TableCell sx={{ fontSize: '0.855rem !important' }}>{item.Genre}</TableCell>
                  <TableCell sx={{ fontSize: '0.855rem !important' }}>{item.Director}</TableCell>
                  <TableCell sx={{ fontSize: '0.855rem !important' }}>{item.actor}</TableCell>

                  <TableCell>
                    <Stack spacing={2} direction="row">
                      <IconButton
                        onClick={(event) => handleOpenMenu(item, event)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              </>
            ))}
            <Popover
              open={!!open}
              anchorEl={open}
              onClose={() => HandleSelectMenu('close')}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: { width: 140 },
              }}
            >
              <MenuItem onClick={() => handleClick('edit', selectItem)} sx={{ cursor: 'pointer' }}>
                <Iconify
                  icon="eva:edit-fill"
                  sx={{ mr: 2, cursor: 'pointer', transition: 'color 0.3s' }}
                />
                Edit
              </MenuItem>
              <MenuItem onClick={() => handleClick('view', selectItem)} sx={{ cursor: 'pointer' }}>
                <Iconify
                  icon="eva:eye-fill"
                  sx={{ mr: 2, cursor: 'pointer', transition: 'color 0.3s' }}
                />
                View
              </MenuItem>
              <MenuItem
                onClick={() => handleClick('delete', selectItem)}
                sx={{ cursor: 'pointer' }}
              >
                <Iconify
                  icon="eva:trash-2-outline"
                  sx={{ mr: 2, cursor: 'pointer', transition: 'color 0.3s', color: 'red' }}
                />
                Delete
              </MenuItem>
            </Popover>
          </TableBody>
        </Table>
      </TableContainer>
   

      <Snackbar
        open={alert}
        autoHideDuration={3000}
        onClose={() => handleAlertClose()}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: '60px' }}
      >
        <Alert severity={isSuccess ? 'success' : 'fail'} sx={{ width: '100%' }}>
          {' '}
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
