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
import { Alert, Snackbar, MenuItem, TableRow, TableCell, TextField, InputAdornment, } from '@mui/material';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { LogOutMethod } from 'src/utils/format-number';
import { MEMBER_LIST, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './member-view.css';
import { emptyRows, } from '../utils';
import TableNoData from '../table-no-data';
import MemberTableRow from '../member-list';
import TableEmptyRows from '../table-empty-rows';
import ErrorLayout from '../../../Error/ErrorLayout';

export default function MemberView() {

  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const Session = localStorage.getItem('apiToken');
  const [MemberList, setMemberList] = useState([]);
  const [MemberListLoading, setMemberListLoading] = useState(true);
  const [ActiveFilter, setActiveFilter] = useState(1);
  const [AlertOpen, setAlertOpen] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertFrom, setAlertFrom] = useState('');
  const [ErrorAlert, setErrorAlert] = useState(false);
  const [ErrorScreen, setErrorScreen] = useState('');
  const [TotalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setTotalCount(0);
    setMemberList([]);
    GetMemberList(ActiveFilter, filterName, page * rowsPerPage, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, ActiveFilter, filterName]);

  const GetMemberList = (isActive, text, start, limit) => {
    setMemberListLoading(true);
    setTotalCount(0);
    setMemberList([]);
    const url = `${REACT_APP_HOST_URL}${MEMBER_LIST}${isActive}&search=${text}&start=${start}&limit=${limit}`;
    // console.log(JSON.parse(Session) + url)
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setMemberListLoading(false);
        if (json.success) {
          setTotalCount(json.total);
          setMemberList([...MemberList, ...json.list]);
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
        setMemberListLoading(false);
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
      })
  }

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
    setMemberList([]);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setTotalCount(0);
    setMemberList([]);
    setFilterName(event.target.value);
  };

  const HandleAddMemberClick = () => {
    navigate('/member/add', {
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
    setMemberList([]);
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
    <div className='mem-list'>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2}>
        <Typography variant="h6" sx={{fontWeight:'600'}}>Member List</Typography>

        <Button variant="contained" className='custom-button' onClick={HandleAddMemberClick} sx={{ cursor: 'pointer' }}>
          Add New
        </Button>
      </Stack>
      <Card>

        <Stack mb={2} mt={2} ml={3} mr={3} direction="row" alignItems="center" gap='20px' className='mbl-view'>
          <TextField
            className='search-text-field'
            placeholder="Search member..."
            value={filterName}
            onChange={(e) => handleFilterByName(e)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" className="search-icon-adornment">
                  <Iconify
                   className="search-icon"
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
        {MemberListLoading
          ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
          </Stack>
          : <Stack sx={{ paddingLeft: 3, paddingRight: 3 }}>
            <Scrollbar>
              <div className="table-container" >
                <TableContainer sx={{ overflow: 'unset' }}>
                  <Table sx={{ minWidth: 800 }}>
                    <TableRow hover tabIndex={-1}>
                      <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Member Name</TableCell>
                      <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Acc No</TableCell>
                      <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Mobile Number</TableCell>
                      <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Status</TableCell>
                      <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} align='right'>Action</TableCell>
                    </TableRow>
                    <TableBody>
                      {MemberList
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <MemberTableRow
                            key={row.id}
                            selected={selected.indexOf(row.name) !== -1}
                            handleClick={(event) => handleClick(event, row.name)}
                            item={row}
                          />))}
                      <TableEmptyRows
                        height={77}
                        emptyRows={emptyRows(page, rowsPerPage, MemberList.length)} />
                      {MemberList.length === 0 && <TableNoData query={filterName} />}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Scrollbar>
            {MemberList.length > 0 && <TablePagination
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
