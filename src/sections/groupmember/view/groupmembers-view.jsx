import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { Card, Table, Alert, Button, Dialog, Snackbar, TableBody, InputLabel, IconButton, FormControl, FormHelperText, InputAdornment, TableContainer, TablePagination, } from '@mui/material';

import { GetHeader, PostHeader } from 'src/hooks/AxiosApiFetch';

import { MEMBER_LIST, GROUP_LISTALL, ADDRESS_DETAIL, GROUP_MEMBER_LIST, GROUP_MEMBER_SAVE, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';
import TableHeader from 'src/sections/member/table-head';
import TableNoData from 'src/sections/member/table-no-data';
import TableEmptyRows from 'src/sections/member/table-empty-rows';

import "./Groupmember.css";
import GroupSearch from '../group-search';
import GroupMemberTableRow from '../groupmember-member-list';

export default function GroupMemberView() {

  // const UserDetail = JSON.parse(localStorage.getItem('userDetails'));
  const Session = localStorage.getItem('apiToken');
  const [grouplist, setGroupList] = useState([]);
  const [groupMemberlist, setGroupMemberList] = useState([]);
  const [memberDetail, setMemberDetail] = useState({});
  const [MemberListAlert, setMemberListAlert] = useState(false);
  const [MemberListLoading, setMemberListLoading] = useState(true);
  const [MemberList, setMemberList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [TotalCount, setTotalCount] = useState('');
  const [AlertOpen, setAlertOpen] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertFrom, setAlertFrom] = useState('');
  const [ErrorAlert, setErrorAlert] = useState(false);
  const [ErrorScreen, setErrorScreen] = useState('');
  const [SelectedIndex, setSelectedIndex] = useState('');
  const [TicketNoClick, setTicketNoClick] = useState(false);
  const [GroupMemberLoading, setGroupMemberLoading] = useState(true);
  const [Loading, setLoading] = useState(false);
  const [ScreenRefresh, setScreenRefresh] = useState(0);
  const [GroupMemberId, setGroupMemberId] = useState('');

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    GetGroupList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTotalCount(0);
    setMemberList([]);
    GetMemberList(1, filterName, page * rowsPerPage, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterName]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (ScreenRefresh) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [ScreenRefresh]);

  const GetGroupMemberList = (isActive, selectedGroupId, selectedMemberId) => {
    // const memberId = '';
    setGroupMemberLoading(true);
    if (selectedMemberId === undefined || selectedMemberId == null || selectedMemberId === '' || selectedMemberId === "undefined") {
      selectedMemberId = '';
    }
    const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_LIST}?groupId=${selectedGroupId}&id=${selectedMemberId}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setGroupMemberLoading(false);
        if (json.success) {
          const { list } = json;
          const { groupno, groupId, groupAddressId, amount, duration, auction_mode } = list[0];
          const commonProperties = {
            groupno,
            groupId,
            groupAddressId,
            amount,
            duration,
            auction_mode
          };
          // Initialize newList with empty slots based on duration
          const newList = Array.from({ length: list[0].duration }, (_, index) => ({
            id: `empty_${index}`,
            memberName: '',
            tktno: index + 1,
            ...commonProperties
          }));

          // Place each member at the correct index based on tktno
          list.forEach((member) => {
            const index = member.tktno - 1; // Adjust tktno to be 0-based index
            if (index >= 0 && index < list[0].duration) {
              newList[index] = { ...newList[index], ...member };
            }
          });
          // console.log(JSON.stringify(newList));
          setGroupMemberList(newList);
          GetMemberDetail(1, newList[0].id, 2, '')

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
        // console.log(error);
        setGroupMemberLoading(false);
        setErrorAlert(true);
        setErrorScreen("error");
      });
  };

  const GetMemberDetail = (isActive, id, from, index) => {
    const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_LIST}?id=${id}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        if (json.success) {
          setTicketNoClick(false);
          if(json.list.length > 0){
            setMemberDetail(json.list[0]);
          }
          if (from === 3) {
            if (TicketNoClick) {
              setAlertMessage("please save the already selected Ticket No");
              setAlertFrom("save_alert");
              HandleAlertShow();
            } else {
              // console.log(index)
              if (index !== 0) {
                setMemberListAlert(true);
                GetMemberList(1, filterName, page * rowsPerPage, rowsPerPage);
              }
              if(json.list.length > 0){
                setGroupMemberId(json.list[0].id)
              }else{
                setGroupMemberId('');
              }
            }
          }
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
        setMemberListAlert(false);
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
      });
  };

  const GetMemberList = (isActive, text, start, limit) => {
    setMemberListLoading(true);
    setTotalCount(0);
    setMemberList([]);
    const url = `${REACT_APP_HOST_URL}${MEMBER_LIST}${isActive}&search=${text}&start=${start}&limit=${limit}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
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
        // console.log(error);
      })
  }

  const GetAddressView = (id, memberDetails) => {
    const url = `${REACT_APP_HOST_URL}${ADDRESS_DETAIL}${id}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        if (json.success) {
          if(json.list !== null){
            const updatedItem = {
              ...memberDetails,
              ...json.list
            };
            // console.log(updatedItem)
            setMemberDetail(updatedItem);
          }
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
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
      })
  }

  const GroupMemberInfoParams = {
    "groupid": memberDetail.groupId,
    "memberid": memberDetail.memberId,
    "tkt_suffix": "A",
    "tkt_percentage": "100",
    "tktno": memberDetail.tktno,
    "addressid": memberDetail && memberDetail.addressId ? memberDetail.addressId : "",
  }

  const GroupMemberUpdateInfoParams = {
    "groupid": memberDetail.groupId,
    "memberid": memberDetail.memberId,
    "tkt_suffix": "A",
    "tkt_percentage": "100",
    "tktno": memberDetail.tktno,
    "addressid": memberDetail && memberDetail.addressId ? memberDetail.addressId : "",
    "id": GroupMemberId
  }

  // groupmember update in request need to pass id param

  const GroupMemberAddMethod = (IsValidate) => {
    if (IsValidate) {
      setLoading(true);
      let url = '';
      let Params = '';
      url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_SAVE}`;
      if (GroupMemberId !== ""){
        Params = GroupMemberUpdateInfoParams;
      }else{
        Params = GroupMemberInfoParams;
      }
      // console.log(JSON.stringify(Params) + url);
      fetch(url, PostHeader(JSON.parse(Session), Params))
        .then((response) => response.json())
        .then((json) => {
          // console.log(JSON.stringify(json));
          setLoading(false);
          setScreenRefresh(0);
          if (json.success) {
            setAlertMessage(json.message);
            setAlertFrom("success");
            HandleAlertShow();
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
          setLoading(false);
          setErrorAlert(true);
          setErrorScreen("error");
          // console.log(error);
        })
    }
  }

  const HandleAlertShow = () => {
    setAlertOpen(true);
  };

  const HandleAlertClose = () => {
    setAlertOpen(false);
    if (AlertFrom === "success") {
      window.location.reload();
    }
  };

  const handleGroupClick = (isActive, id) => {
    // Call your specific function here
    // console.log('Clicked item ID:', id);
    // You can call another function and pass the id as needed
    GetGroupMemberList(1, id);

  };

  const GetGroupList = (isActive) => {
    const url = REACT_APP_HOST_URL + GROUP_LISTALL;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        if (json.success) {
          setGroupList(json.list);
          GetGroupMemberList(1, json.list[0].id);
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
        // console.log(error);
        setErrorAlert(true);
        setErrorScreen("error");
      })
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMemberDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const style = {
    p: 0,
    width: '100%',
    maxWidth: 360,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
  };

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

  const handleClick = (event, item) => {
    const selectedIndex = selected.indexOf(item.name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, item.name);
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
    setTicketNoClick(true);
    const updatedGroupMemberList = [...groupMemberlist];
    if (SelectedIndex >= 0 && SelectedIndex < updatedGroupMemberList.length) {
      const updatedItem = {
        ...updatedGroupMemberList[SelectedIndex],
        ...item, 
        memberName: item.name,
        memberId: item.id,
        memdob: item.dob,
      };
      // console.log(updatedItem)
      updatedGroupMemberList[SelectedIndex] = updatedItem;
      setGroupMemberList(updatedGroupMemberList);
      GetAddressView(item.id, updatedItem);
    }
    setMemberListAlert(false);
    
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

  const HandleSubmitClick = () => {
    GroupMemberAddMethod(true);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setTotalCount(0);
    setMemberList([]);
    setFilterName(event.target.value);
  };

  /* const HandleBack = () => {
    if (ScreenRefresh) {
      const confirmNavigation = window.confirm(
        'You have unsaved changes. Are you sure you want to leave this page?'
      );
      if (confirmNavigation) {
        setScreenRefresh(0);
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  } */

  if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} >
        <Typography variant="h4">Group Member</Typography>
      </Stack>
      <GroupSearch groupList={grouplist} />
      {GroupMemberLoading
        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
          <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
        </Stack>
        :
      <Box sx={{ flexGrow: 1 }} className="toppadding">
        <Grid container className="groupN" spacing={2}>
          <Grid item xs={12} md={4}>
            <List sx={style} aria-label="mailbox folders">
              {grouplist.map((option) => (
                <>
                  <ListItem key={option.id} onClick={() => handleGroupClick(1, option.id)}>
                    <ListItemText primary={option.groupno} />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <List sx={style} aria-label="mailbox folders">
              {groupMemberlist.map((member, index) => (
                <>
                  <ListItem key={member.id} onClick={() => { GetMemberDetail(1, member.id, 3, index); setSelectedIndex(index);}}>
                    <ListItemText primary={`${member.tktno} .  ${member.memberName}`} />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <Item>
              <Typography variant="h6">Group Detail</Typography>
              <FormControl>
                <InputLabel htmlFor="group-no">Group No</InputLabel>
                <TextField
                  id="group-no"
                  name="groupno"
                  value={memberDetail.groupno || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
                <FormHelperText id="group-no-helper-text">We&apos;ll never share your email.</FormHelperText>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="amount">Amount</InputLabel>
                <TextField
                  id="amount"
                  name="amount"
                  value={memberDetail.amount || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="duration">Duration</InputLabel>
                <TextField
                  id="duration"
                  name="duration"
                  value={memberDetail.duration || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                {/* <InputLabel htmlFor="auction-mode">Auction Mode</InputLabel> */}
                <TextField
                  id="auction-mode"
                  name="auction_mode"
                  value={memberDetail.auction_mode || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <Typography variant="h6">Member Detail</Typography>
              <FormControl>
                <InputLabel htmlFor="member-name">Member Name</InputLabel>
                <TextField
                  id="member-name"
                  name="memberName"
                  value={memberDetail.memberName || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="tktno">Ticket No</InputLabel>
                <TextField
                  id="tktno"
                  name="tktno"
                  value={memberDetail.tktno || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                {/* <InputLabel htmlFor="member-id">Member ID</InputLabel> */}
                <TextField
                  id="member-id"
                  name="memberId"
                  value={memberDetail.memberId || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                {/* <InputLabel htmlFor="memdob">Date of Birth</InputLabel> */}
                <TextField
                  id="memdob"
                  name="memdob"
                  value={memberDetail.memdob || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                {/* <InputLabel htmlFor="mapped-phone">Mapped Phone</InputLabel> */}
                <TextField
                  id="mapped-phone"
                  name="mapped_phone"
                  value={memberDetail.mapped_phone || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                {/* <InputLabel htmlFor="email">Email</InputLabel> */}
                <TextField
                  id="email"
                  name="email"
                  value={memberDetail.email || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <Typography variant="h6">Address Detail</Typography>
              <div className="address-section">
                <p>{memberDetail.addressline1}</p>
                <p>{memberDetail.addressline2}</p>
                <p>{memberDetail.landmark}</p>
                <p>{memberDetail.city}</p>
                <p>{memberDetail.state}</p>
                <p>{memberDetail.country}</p>
              </div>
            </Item>
          </Grid>
        </Grid>
          <Stack direction='column' alignItems='flex-end'>
            <Button sx={{ mr: 5, mb: 3, height: 50, width: 150, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={Loading ? null : HandleSubmitClick}>
              {Loading
                ? (<img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                : ("Submit")}
            </Button>
          </Stack>
      </Box> }
      <Snackbar open={AlertOpen} autoHideDuration={AlertFrom === "save_alert" ? 2000 : 1000} onClose={HandleAlertClose} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: '60px' }}>
        <Alert
          onClose={HandleAlertClose}
          severity={AlertFrom === "failed" || AlertFrom === "save_alert" ? "error" : "success"}
          variant="filled"
          sx={{ width: '100%' }} >
          {AlertMessage}
        </Alert>
      </Snackbar>
      <Dialog
       
        open={MemberListAlert}
        fullWidth
        maxWidth="md"
        sx={{ display: 'flex', justifyContent: 'center', flex: 1, }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" >
        <Card   sx={{ maxWidth: '800px' }}>
          
          <Stack sx={{ height: '100%', maxHeight: '100vh', overflow: 'hidden' }}>
            <Typography variant="subtitle1" sx={{ ml: 2, mr: 5, mt: 2 }}>
              Member List
            </Typography>
            <Stack mt={1} ml={2} mr={1} direction="row" alignItems="center">
              <TextField
                placeholder="Member Name..."
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
              <IconButton
                aria-label="close"
                onClick={() => setMemberListAlert(false)}
                sx={{ position: 'absolute', right: 15, top: 5, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }}
              >
                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 17, height: 17 }} />
              </IconButton>
            </Stack>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }}>
              <Scrollbar>
                <TableContainer sx={{ overflow: '', mt: 2 }}>
                  <Table className='pop-dialog' sx={{ minWidth: 800 }} stickyHeader>
                    <TableHeader
                 
                      order={order}
                      orderBy={orderBy}
                      rowCount={MemberList.length}
                      numSelected={selected.length}
                      onRequestSort={handleSort}
                      onSelectAllClick={handleSelectAllClick}
                      headLabel={[
                        { id: 'Member Name', label: 'Member Name' },
                        { id: 'Acc No', label: 'Acc No' },
                        { id: 'Mobile Number', label: 'Mobile Number' },
                        { id: 'Status', label: 'Status' },
                      ]} />
                    {MemberListLoading
                      ? <Stack mt={10} sx={{ alignItems: 'center' }}>
                        <img className="load" src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                      </Stack>
                      : <TableBody>
                        {MemberList
                          .map((row) => (
                            <GroupMemberTableRow
                         
                              key={row.id}
                              selected={selected.indexOf(row.name) !== -1}
                              handleClick={(event) => handleClick(event, row)}
                              item={row} />))}
                        <TableEmptyRows
                          height={77}
                          emptyRows={emptyRows(page, 5, MemberList.length)} />
                        {MemberList.length === 0 && <TableNoData query={filterName} />}
                      </TableBody>}
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Box>
            {MemberList.length > 0 && <TablePagination
              page={page}
              component="div"
              count={TotalCount}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 20]}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ borderTop: '1px solid #e0e0e0' }}
            />}
          </Stack>
        </Card>
      </Dialog>
    </Container>
  );
}