import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Alert, Snackbar, TableRow, TableCell, TextField, IconButton, InputAdornment } from '@mui/material';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { LogOutMethod } from 'src/utils/format-number';
import { GROUP_LIST, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';

import './chitauction-view.css';
import TableNoData from '../../member/table-no-data';
import ErrorLayout from '../../../Error/ErrorLayout';
import TableEmptyRows from '../../member/table-empty-rows';

export default function ChitAuctionView() {

  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const Session = localStorage.getItem('apiToken');
  const [ChitAuctionList, setChitAuctionList] = useState([]);
  const [ChitAuctionLoading, setChitAuctionLoading] = useState(true);
  const [AlertOpen, setAlertOpen] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertFrom, setAlertFrom] = useState('');
  const [ErrorAlert, setErrorAlert] = useState(false);
  const [ErrorScreen, setErrorScreen] = useState('');
  const [TotalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setTotalCount(0);
    setChitAuctionList([]);
    GetChitAuctionList(1, filterName, page * rowsPerPage, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterName]);

  const GetChitAuctionList = (isactive, text, start, limit) => {
    setChitAuctionLoading(true);
    setTotalCount(0);
    setChitAuctionList([]);
    const url = `${REACT_APP_HOST_URL}${GROUP_LIST}${isactive}&search=${text}&start=${start}&limit=${limit}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setChitAuctionLoading(false);
        if (json.success) {
          setTotalCount(json.total);
          setChitAuctionList([...ChitAuctionList, ...json.list]);
        } else if (json.success === false) {
          if (json.code === 2 || json.code === "2") {
            LogOutMethod(navigate);
          } else {
            setAlertMessage(json.message);
            setAlertFrom("failed");
            HandleAlertShow();
          }
        } else {
          setErrorAlert(true);
          setErrorScreen("network");
        }
      })
      .catch((error) => {
        setChitAuctionLoading(false);
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
      })
  }

  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setTotalCount(0);
    setChitAuctionList([]);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setTotalCount(0);
    setChitAuctionList([]);
    setFilterName(event.target.value);
  };

  const HandleAddChitAuctionClick = () => {
    navigate('/chitauction/add', {
      state: {
        screen: 'add',
        data: [],
      },
    });
  };

  const HandleAlertShow = () => {
    setAlertOpen(true);
  };

  const HandleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleOpenScreen = (row) => {
    navigate(`/chitauction/add`, {
      state: {
        screen: 'add',
        data: row,
      },
    });
  };

  const formatNumber = (number) => new Intl.NumberFormat('en-IN').format(number);

  if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

  return (
    <div  className='actionlist-screen'>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2} >
      <Typography variant="h6" sx={{ fontWeight:'600'}}>Chit Auction List</Typography>
        <Button variant="contained" className='custom-button' sx={{ display: 'none' }}  onClick={HandleAddChitAuctionClick}>
          Add Chit Auction
        </Button>
      </Stack>
      <Card>
        <Stack m={3} direction="row" alignItems="center" gap='40px' className='mbl-view'>
          <TextField
           className="search-text-field"
            placeholder="Search Group Code..."
            value={filterName}
            onChange={(e) => handleFilterByName(e)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" className="search-icon-adornment">
                  <Iconify
                    icon="eva:search-fill"
                    className="search-icon"
                    sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-input': {
                padding: '8px', 
              },
              '& .MuiInputAdornment-root': {
                padding: '8px', 
              },
            }}
            
          />
        </Stack>
        {ChitAuctionLoading
          ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
          </Stack>
          : <Stack sx={{ paddingLeft: 3, paddingRight: 3 }}>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableRow hover tabIndex={-1}>
                    <TableCell sx={{ width:'10%',background: '#edf4fe', color: '#1877f2', }}>Group Code</TableCell>
                    <TableCell className='duration-cell' sx={{  width:'10%',background: '#edf4fe', color: '#1877f2', }}>Duration</TableCell>
                    <TableCell className='auction-cell' sx={{width:'10%', background: '#edf4fe', color: '#1877f2', }}>Auction Mode</TableCell>
                    <TableCell className='amount-cell' sx={{ width:'20%',background: '#edf4fe', color: '#1877f2', }} align='right'>Amount</TableCell>
                    <TableCell className='status-cell' sx={{ width:'20%',background: '#edf4fe', color: '#1877f2', paddingLeft: '70px !important',}} >Status</TableCell>
                    <TableCell sx={{ width:'10%', background: '#edf4fe', color: '#1877f2', }} align='right'>Action</TableCell>
                  </TableRow>
                  <TableBody>
                    {ChitAuctionList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow hover tabIndex={-1} role="checkbox">
                          <TableCell  sx={{  width:'10%'}}>{row.groupno}</TableCell>
                          <TableCell   sx={{  width:'10%'}} className='duration-cell'>{row.duration}</TableCell>
                          <TableCell  sx={{  width:'10%'}} className='auction-cell'>{row.auction_mode}</TableCell>
                          <TableCell  sx={{  width:'20%'}} className='amount-cell' align="right">{row.amount != null && row.amount !== "" ? formatNumber(Math.round(row.amount)) : ""}</TableCell>
                          <TableCell  sx={{  width:'20%',paddingLeft: '70px !important',}} className='status-cell'>{row.status}</TableCell>
                          <TableCell  sx={{  width:'10%'}} align="right">
                            <IconButton onClick={() => handleOpenScreen(row)} sx={{ cursor: 'pointer' }}>
                              <Iconify icon="eva:edit-fill" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, ChitAuctionList.length)}
                    />
                    {ChitAuctionList.length === 0 && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            {ChitAuctionList.length > 0 && <TablePagination
              page={page}
              component="div"
              count={TotalCount}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[15, 30, 50]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />}
          </Stack>}
      </Card>
      <Snackbar open={AlertOpen} autoHideDuration={1000} onClose={HandleAlertClose} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: '60px' }}>
        <Alert
          onClose={HandleAlertClose}
          severity={AlertFrom === "failed" ? "error" : "success"}
          variant="filled"
          sx={{ width: '100%' }} >
          {AlertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

