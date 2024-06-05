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
import { Dialog, MenuItem, TextField, IconButton, InputAdornment } from '@mui/material';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { MEMBER_LIST, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './member-view.css';
import { emptyRows, } from '../utils';
import TableHeader from '../table-head';
import TableNoData from '../table-no-data';
import MemberTableRow from '../member-list';
import TableEmptyRows from '../table-empty-rows';
import ErrorLayout from '../../../Error/ErrorLayout';

export default function MemberView() {

  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const Session = localStorage.getItem('apiToken');
  const [MemberList, setMemberList] = useState([]);
  const [MemberListLoading, setMemberListLoading] = useState(true);
  const [ActiveFilter, setActiveFilter] = useState(1);
  const [Alert, setAlert] = useState(false);
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
    console.log(url);
    console.log(Session)
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        console.log(MemberList.length);
        console.log(JSON.stringify(json));
        setMemberListLoading(false);
        if (json.success) {
          setTotalCount(json.total);
          setMemberList([...MemberList, ...json.list]);
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
        setMemberListLoading(false);
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
      const newSelecteds = MemberList.map((n) => n.name);
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
    console.log(newPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setTotalCount(0);
    setMemberList([]);
    setFilterName(event.target.value);
  };

  const HandleAddMemberClick = () => {
    navigate('/addMember', {
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
    console.log(text);
    setPage(0);
    setTotalCount(0);
    setMemberList([]);
    setActiveFilter(text);
  };

  const HandleAlertShow = () => {
    setAlert(true);
  };

  const HandleAlertClose = () => {
    setAlert(false);
  };
  
  if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2}>
        <Typography variant="h6" sx={{color: '#637381' }}>Member List</Typography>

        <Button variant="contained"   className='custom-button' startIcon={<Iconify icon="eva:plus-fill" />} onClick={HandleAddMemberClick} sx={{ cursor: 'pointer' }}>
          Add Member
        </Button>
      </Stack>
       <Card>
        <Stack mb={2} mt={2} ml={3} mr={3} direction="row" alignItems="center" justifyContent="space-between">
          <TextField
            placeholder="Search member..."
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
              ),}} />
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
            <img src="../../../public/assets/icons/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
          </Stack>
          :<Stack>
            <Scrollbar>
            <div className="table-container" >
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHeader
                  sx={{ background: 'rgba(24, 119, 242, 0.16)', color: '#1877f2' }}
                    order={order}
                    orderBy={orderBy}
                    rowCount={MemberList.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel  ={[
                      { id: 'Member Name', label: 'Member Name' },
                      { id: 'Acc No', label: 'Acc No' },
                      { id: 'Mobile Number', label: 'Mobile Number' },
                      { id: 'Status', label: 'Status' },
                      { id: '' }, ]} />
                     
                  <TableBody>
                      {MemberList
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <MemberTableRow
                          key={row.id}
                          selected={selected.indexOf(row.name) !== -1}
                          handleClick={(event) => handleClick(event, row.name)}
                          item={row}
                        /> ))}
                        
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
      <Dialog
        open={Alert}
        onClose={HandleAlertClose}
        fullWidth={500}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" >
        <IconButton
          aria-label="close"
          onClick={HandleAlertClose}
          sx={{ position: 'absolute', right: 15, top: 20, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }} >
          <img src="../../../public/assets/icons/cancel.png" alt="Loading" style={{ width: 17, height: 17, }} />
        </IconButton>
        <Stack style={{ alignItems: 'center', }} mt={5}>
          {AlertFrom === "success"
            ? <img src="../../../public/assets/icons/success_gif.gif" alt="Loading" style={{ width: 130, height: 130, }} />
            : <img src="../../../public/assets/icons/failed_gif.gif" alt="Loading" style={{ width: 130, height: 130, }} />}
          <Typography gutterBottom variant='h4' mt={2} mb={5} color={AlertFrom === "success" ? "#45da81" : "#ef4444"}>
            {AlertMessage}
          </Typography>
        </Stack>
      </Dialog>
    </Container>
  );
}
