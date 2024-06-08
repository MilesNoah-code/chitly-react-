import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Alert, Snackbar, MenuItem, TextField, InputAdornment } from '@mui/material';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { GROUP_LIST, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';

import './chitestimate-view.css';
import TableHeader from '../../member/table-head';
import TableNoData from '../../member/table-no-data';
import ErrorLayout from '../../../Error/ErrorLayout';
import ChitEstimateTableRow from '../chitestimate-list';
import TableEmptyRows from '../../member/table-empty-rows';

export default function ChitEstimateView() {

  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
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
  const [ChitEstimateFilter, setChitEstimateFilter] = useState(1);
  const [TotalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setTotalCount(0);
    setChitEstimateList([]);
    GetChitEstimateList(ActiveFilter, ChitEstimateFilter, filterName, page * rowsPerPage, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, ActiveFilter, ChitEstimateFilter, filterName]);

  const GetChitEstimateList = (isactive, chitestimate, text, start, limit) => {
    setChitEstimateLoading(true);
    setTotalCount(0);
    setChitEstimateList([]);
    const url = `${REACT_APP_HOST_URL}${GROUP_LIST}${isactive}&toDate=${chitestimate}&search=${text}&start=${start}&limit=${limit}`;
    console.log(url);
    console.log(Session)
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
        console.log(error);
      })
  }

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = ChitEstimateList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
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
    { value: 1, label: 'Both' },
    { value: 2, label: 'Chit Estimate Done' },
    { value: 3, label: 'Chit Estimate Not Done' },
  ];

  const handleFilterByActive = (e) => {
    const text = e.target.value;
    console.log(text);
    setPage(0);
    setTotalCount(0);
    setChitEstimateList([]);
    setActiveFilter(text);
  };

  const handleFilterByChitEstimate = (e) => {
    const text = e.target.value;
    console.log(text);
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

  if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2} >
        <Typography variant="h6" sx={{ color: '#637381' }}>Chit Estimate List</Typography>
        <Button variant="contained" className='custom-button' startIcon={<Iconify icon="eva:plus-fill" />} onClick={HandleAddChitEstimateClick}>
          Add Chit Estimate
        </Button>
      </Stack>
      <Card>
        <Stack mb={2} mt={2} ml={3} mr={3} direction="row" alignItems="center" gap='40px' className='mbl-view'>
          <TextField
            placeholder="Search Group Code..."
            value={filterName}
            onChange={(e) => handleFilterByName(e)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            }}
          />
          <TextField select size="small" value={ActiveFilter} onChange={(e) => handleFilterByActive(e)}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField select size="small" value={ChitEstimateFilter} onChange={(e) => handleFilterByChitEstimate(e)}>
            {options1.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        {ChitEstimateLoading
          ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
            <img src="../../../../public/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
          </Stack>
          : <Stack>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHeader
                    order={order}
                    orderBy={orderBy}
                    rowCount={ChitEstimateList.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'Group Code', label: 'Group Code' },
                      { id: 'Amount', label: 'Amount' },
                      { id: 'Duration', label: 'Duration' },
                      { id: 'Auction Mode', label: 'Auction Mode' },
                      { id: '' },
                    ]} />
                  <TableBody>
                    {ChitEstimateList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <ChitEstimateTableRow
                          key={row.id}
                          selected={selected.indexOf(row.name) !== -1}
                          handleClick={(event) => handleClick(event, row.name)}
                          item={row}
                        />
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
      <Snackbar open={AlertOpen} autoHideDuration={1000} onClose={HandleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          onClose={HandleAlertClose}
          severity={AlertFrom === "failed" ? "error" : "success"}
          variant="filled"
          sx={{ width: '100%' }} >
          {AlertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

