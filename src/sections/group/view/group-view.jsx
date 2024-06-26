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
import { Alert, MenuItem, Snackbar, TextField, InputAdornment } from '@mui/material';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { GROUP_LIST, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';

import './group-view.css';
import GroupTableRow from '../group-list';
import TableHeader from '../../member/table-head';
import TableNoData from '../../member/table-no-data';
import ErrorLayout from '../../../Error/ErrorLayout';
import TableEmptyRows from '../../member/table-empty-rows';

export default function GroupView() {

  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const Session = localStorage.getItem('apiToken');
  const [GroupList, setGroupList] = useState([]);
  const [GroupListLoading, setGroupListLoading] = useState(true);
  const [ActiveFilter, setActiveFilter] = useState(1);
  const [AlertOpen, setAlertOpen] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertFrom, setAlertFrom] = useState('');
  const [ErrorAlert, setErrorAlert] = useState(false);
  const [ErrorScreen, setErrorScreen] = useState('');
  const [TotalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setTotalCount(0);
    setGroupList([]);
    GetGroupList(ActiveFilter, filterName, page * rowsPerPage, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, ActiveFilter, filterName]);

  const GetGroupList = (isActive, text, start, limit) => {
    setGroupListLoading(true);
    setTotalCount(0);
    setGroupList([]);
    const url = `${REACT_APP_HOST_URL}${GROUP_LIST}${isActive}&search=${text}&start=${start}&limit=${limit}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setGroupListLoading(false);
        if (json.success) {
          setTotalCount(json.total);
          setGroupList([...GroupList, ...json.list]);
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
        setGroupListLoading(false);
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
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
      const newSelecteds = GroupList.map((n) => n.name);
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
    setTotalCount(0);
    setGroupList([]);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setTotalCount(0);
    setGroupList([]);
    setFilterName(event.target.value);
  };

  const HandleAddGroupClick = () => {
    navigate('/group/add', {
      state: {
        screen: 'add',
        data: [],
      },
    });
  }

  const options = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'InActive' },
  ];

  const handleFilterByActive = (e) => {
    const text = e.target.value;
    setPage(0);
    setTotalCount(0);
    setGroupList([]);
    setActiveFilter(text);
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
        <Typography variant="h6" sx={{ color: '#637381' }}>Group List</Typography>
        <Button variant="contained" className='custom-button'  onClick={HandleAddGroupClick} sx={{ cursor: 'pointer' }}>
          Add Group
        </Button>
      </Stack>
      <Card>
        <Stack mb={2} mt={2} ml={3} mr={3} direction="row" alignItems="center" gap='30px' className='mbl-view'>
          <TextField
            placeholder="Search Group..."
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
            sx={{
              '& .MuiInputBase-input': {
                padding: '8px', 
              },
              '& .MuiInputAdornment-root': {
                padding: '8px', 
              },
            }}
          />
          <TextField select size="small" value={ActiveFilter} onChange={(e) => handleFilterByActive(e)}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        {GroupListLoading
          ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
          </Stack>
          : <Stack>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHeader
                    order={order}
                    orderBy={orderBy}
                    rowCount={GroupList.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'Group Id', label: 'Group Id' },
                      { id: 'Group Name', label: 'Group Name' },
                      { id: 'Duration', label: 'Duration' },
                      { id: 'Auction Mode', label: 'Auction Mode' },
                      { id: 'Amount', label: 'Amount' },
                      { id: '' },
                    ]} />
                  <TableBody>
                    {GroupList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <GroupTableRow
                          key={row.id}
                          selected={selected.indexOf(row.name) !== -1}
                          handleClick={(event) => handleClick(event, row.name)}
                          item={row}
                        />
                      ))}
                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, GroupList.length)}
                    />
                    {GroupList.length === 0 && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            {GroupList.length > 0 && <TablePagination
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