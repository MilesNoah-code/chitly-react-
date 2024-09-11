import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

export default function MovieView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { screen, data } = location.state || {};
  const goBack = () => {
    navigate('/movies');
  };
  const StyledRow = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: 'edf4fe',
      color: '#1877f2',
    },
  }));

  return (
    <Stack
      spacing={2}
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
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Typography align="left" sx={{ fontSize: '20px', mb: '10px', fontWeight: 'bold' }}>
          Movie Details
        </Typography>
        <Button variant="contained" onClick={goBack}>
          {' '}
          Back{' '}
        </Button>
      </Stack>{' '}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <StyledRow sx={{ fontSize: '0.855rem !important' }}>Name</StyledRow>
              <StyledRow sx={{ fontSize: '0.855rem !important' }}>Year</StyledRow>
              <StyledRow sx={{ fontSize: '0.855rem !important' }}>Genere</StyledRow>
              <StyledRow sx={{ fontSize: '0.855rem !important' }}>Director</StyledRow>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableCell sx={{ fontSize: '0.855rem !important' }}>{data.Title}</TableCell>
            <TableCell sx={{ fontSize: '0.855rem !important' }}>{data.Year}</TableCell>
            <TableCell sx={{ fontSize: '0.855rem !important' }}>{data.Genre}</TableCell>
            <TableCell sx={{ fontSize: '0.855rem !important' }}>{data.Director}</TableCell>
          </TableBody>
        </Table>
      </TableContainer>
      {data.Actors.length > 0 ? (
        <>
          <Typography align="left" sx={{ fontSize: '20px', mb: '10px', fontWeight: 'bold' }}>
            {' '}
            Actor Details{' '}
          </Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <StyledRow sx={{ fontSize: '0.855rem !important' }}>Name</StyledRow>
                  <StyledRow sx={{ fontSize: '0.855rem !important' }}>Birth Year</StyledRow>
                  <StyledRow sx={{ fontSize: '0.855rem !important' }}>Native</StyledRow>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.Actors.map((a) => (
                  <TableRow>
                    <TableCell sx={{ fontSize: '0.855rem !important' }}>{a.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.855rem !important' }}>{a.birthYear}</TableCell>
                    <TableCell sx={{ fontSize: '0.855rem !important' }}>{a.native}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        ''
      )}
    </Stack>
  );
}
