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
import { Alert, Snackbar, MenuItem, TableRow, TableCell, TextField, IconButton, InputAdornment } from '@mui/material';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { GROUP_LIST, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';

import './chitestimate-view.css';
import TableNoData from '../../member/table-no-data';
import ErrorLayout from '../../../Error/ErrorLayout';
import TableEmptyRows from '../../member/table-empty-rows';

export default function ChitEstimateView() {

  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const Session = localStorage.getItem('apiToken');
  const [ChitEstimateList, setChitEstimateList] = useState([]);
  const [ChitEstimateLoading, setChitEstimateLoading] = useState(true);
  const [AlertOpen, setAlertOpen] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertFrom, setAlertFrom] = useState('');
  const [ErrorAlert, setErrorAlert] = useState(false);
  const [ErrorScreen, setErrorScreen] = useState('');
  const [ActiveFilter, setActiveFilter] = useState(1);
  const [ChitEstimateFilter, setChitEstimateFilter] = useState(2);
  const [TotalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setTotalCount(0);
    setChitEstimateList([]);
    GetChitEstimateList(ActiveFilter, ChitEstimateFilter === 2 ? "" : ChitEstimateFilter, filterName, page * rowsPerPage, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, ActiveFilter, ChitEstimateFilter, filterName]);

  const GetChitEstimateList = (isactive, chitestimate, text, start, limit) => {
    setChitEstimateLoading(true);
    setTotalCount(0);
    setChitEstimateList([]);
    const url = `${REACT_APP_HOST_URL}${GROUP_LIST}${isactive}&isEstimateDone=${chitestimate}&search=${text}&start=${start}&limit=${limit}`;
    console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        console.log(JSON.stringify(json));
        setChitEstimateLoading(false);
        if (json.success) {
          setTotalCount(json.total);
          setChitEstimateList([...ChitEstimateList, ...json.list]);
        } else if (json.success === false) {
          setAlertMessage(json.message);
          setAlertFrom("failed");
          HandleAlertShow();
        } else {
          setErrorAlert(true);
          setErrorScreen("network");
        }
      })
      .catch((error) => {
        setChitEstimateLoading(false);
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
    setChitEstimateList([]);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setTotalCount(0);
    setChitEstimateList([]);
    setFilterName(event.target.value);
  };

  const HandleAddChitEstimateClick = () => {
    navigate('/chitestimate/add', {
      state: {
        screen: 'add',
        data: [],
      },
    });
  };

  const options = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'InActive' },
  ];

  const options1 = [
    { value: 2, label: 'Both' },
    { value: 1, label: 'Chit Estimate Done' },
    { value: 0, label: 'Chit Estimate Not Done' },
  ];

  const handleFilterByActive = (e) => {
    const text = e.target.value;
    setPage(0);
    setTotalCount(0);
    setChitEstimateList([]);
    setActiveFilter(text);
  };

  const handleFilterByChitEstimate = (e) => {
    const text = e.target.value;
    setPage(0);
    setTotalCount(0);
    setChitEstimateList([]);
    setChitEstimateFilter(text);
  };

  const HandleAlertShow = () => {
    setAlertOpen(true);
  };

  const HandleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleOpenScreen = (row) => {
    navigate(`/chitestimate/add`, {
      state: {
        screen: 'add',
        data: row,
      },
    });
  };

  const formatNumber = (number) => new Intl.NumberFormat('en-IN').format(number);

  if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

  return (
    <div  className='chitestimate-view-screen'>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2} >
        <Typography variant="h6" sx={{ fontWeight:'600'}}>Chit Estimate List</Typography>
        <Button variant="contained" className='custom-button' sx={{ display: 'none' }}  onClick={HandleAddChitEstimateClick}>
          Add Chit Estimate
        </Button>
      </Stack>
      <Card>
        <Stack mb={2} mt={2} ml={3} mr={3} direction="row" alignItems="center" gap='20px' className='mbl-view'>
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
            sx={{ '& .MuiInputBase-input': { padding: '8px',  },
              '& .MuiInputAdornment-root': { padding: '8px',  },
            }} 
            
            />
          <TextField select size="small" value={ActiveFilter} onChange={(e) => handleFilterByActive(e)}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField select size="small" value={ChitEstimateFilter} onChange={(e) => handleFilterByChitEstimate(e)} >
            {options1.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        {ChitEstimateLoading
          ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
          </Stack>
          : <Stack sx={{ paddingLeft: 3, paddingRight: 3 }}>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableRow hover tabIndex={-1}>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} className='groupcode-column'>Group Code</TableCell>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} className='amount-column' align='right'>Amount</TableCell>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} className='duration-column'>Duration</TableCell>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} className='auction-column'>Auction Mode</TableCell>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} className='action-column' align='right'>Action</TableCell>
                  </TableRow>
                  <TableBody>
                    {ChitEstimateList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow hover tabIndex={-1} role="checkbox">
                          <TableCell>{row.groupno}</TableCell>
                          <TableCell align="right">{row.amount != null && row.amount !== "" ? formatNumber(Math.round(row.amount)) : ""}</TableCell>
                          <TableCell className='duration'>{row.duration}</TableCell>
                          <TableCell>{row.auction_mode}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleOpenScreen(row)} sx={{ cursor: 'pointer' }}>
                              <Iconify icon="eva:edit-fill" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, ChitEstimateList.length)}
                    />
                    {ChitEstimateList.length === 0 && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            {ChitEstimateList.length > 0 && <TablePagination
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

