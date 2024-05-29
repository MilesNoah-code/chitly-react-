import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { GROUP_LIST, REACT_APP_HOST_URL, GROUP_MEMBER_LIST } from 'src/utils/api-constant';
import { GetHeader } from 'src/hooks/AxiosApiFetch';  
import "./Groupmember.css";
import GroupSearch from '../group-search';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { FormControl, InputLabel, Input, FormHelperText } from '@mui/material';

export default function BlogView() {

  const UserDetail = JSON.parse(localStorage.getItem('userDetails'));
  const Session = localStorage.getItem('apiToken');
  const [grouplist, setGroupList] = useState([]);
  const [groupMemberlist, setGroupMemberList] = useState([]);
  const [memberDetail, setMemberDetail] = useState({});

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    GetGroupList(1);
  }, []);

  const GetGroupMemberList = (isActive, selectedGroupId, selectedMemberId) => {
    var memberId = '';
    if (selectedMemberId == undefined || selectedMemberId == null || selectedMemberId == '' || selectedMemberId == "undefined") {
      selectedMemberId = '';
    }
    const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_LIST}?groupId=${selectedGroupId}&id=${selectedMemberId}`;

    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        console.log(JSON.stringify(json));
        if (json.success) {
          const { list, duration } = json;

          // Initialize newList with empty slots based on duration
          const newList = Array.from({ length: list[0].duration }, (_, index) => ({
            id: `empty_${index}`,
            memberName: '',
            tktno: index + 1
          }));

          // Place each member at the correct index based on tktno
          list.forEach((member) => {
            const index = member.tktno - 1; // Adjust tktno to be 0-based index
            if (index >= 0 && index < list[0].duration) {
              newList[index] = member;
            }
          });
          setGroupMemberList(newList);
          GetMemberDetail(1, newList[0].id)

        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const GetMemberDetail = (isActive, id) => {

    const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_LIST}?id=${id}`;

    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        console.log(JSON.stringify(json));
        if (json.success) {
          setMemberDetail(json.list[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGroupClick = (isActive, id) => {
    // Call your specific function here
    console.log('Clicked item ID:', id);
    // You can call another function and pass the id as needed
    GetGroupMemberList(1, id);

  };

  const GetGroupList = (isActive) => {
    const url = REACT_APP_HOST_URL + GROUP_LIST;

    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        console.log(JSON.stringify(json));
        if (json.success) {
          setGroupList(json.list);
          GetGroupMemberList(1, json.list[0].id);
        }
      })
      .catch((error) => {
        console.log(error);
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

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} >
        <Typography variant="h4">Group Member</Typography>
      </Stack>
      <GroupSearch groupList={grouplist} />
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
              {groupMemberlist.map((member) => (
                <>
                  <ListItem key={member.id} onClick={() => GetMemberDetail(1, member.id)}>
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
                <Input
                  id="group-no"
                  name="groupno"
                  value={memberDetail.groupno || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
                <FormHelperText id="group-no-helper-text">We'll never share your email.</FormHelperText>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="amount">Amount</InputLabel>
                <Input
                  id="amount"
                  name="amount"
                  value={memberDetail.amount || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="duration">Duration</InputLabel>
                <Input
                  id="duration"
                  name="duration"
                  value={memberDetail.duration || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="auction-mode">Auction Mode</InputLabel>
                <Input
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
                <Input
                  id="member-name"
                  name="memberName"
                  value={memberDetail.memberName || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="tktno">Ticket No</InputLabel>
                <Input
                  id="tktno"
                  name="tktno"
                  value={memberDetail.tktno || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="member-id">Member ID</InputLabel>
                <Input
                  id="member-id"
                  name="memberId"
                  value={memberDetail.memberId || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="memdob">Date of Birth</InputLabel>
                <Input
                  id="memdob"
                  name="memdob"
                  value={memberDetail.memdob || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="mapped-phone">Mapped Phone</InputLabel>
                <Input
                  id="mapped-phone"
                  name="mapped_phone"
                  value={memberDetail.mapped_phone || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
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
      </Box>
    </Container>
  );
}
