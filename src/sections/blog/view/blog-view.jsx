import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { GROUP_LIST, REACT_APP_HOST_URL } from 'src/utils/api-constant';
import { GetHeader } from 'src/hooks/AxiosApiFetch';  

export default function BlogView() {


  const UserDetail = JSON.parse(localStorage.getItem('userDetails'));
  const Session = localStorage.getItem('apiToken');
  const [group, setGroup] = useState([]);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

useEffect(() => {
  GetGroupList(1);
}, []);

const GetGroupList = (isActive) => {
  const url = REACT_APP_HOST_URL + GROUP_LIST ;
    
  fetch(url, GetHeader(JSON.parse(Session)))
    .then((response) => response.json())
    .then((json) => {
      console.log(JSON.stringify(json));
      if (json.success) {
        setGroup(json.list);
      }
    })
    .catch((error) => {
      console.log(error);
    })
}


  return (
    
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} >
        <Typography variant="h4">Group Member</Typography>
      </Stack>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                  {group.map((option) => (
                    <Item key={option.id}>
                      <h4>{option.groupno}</h4>
                    </Item>
                  ))}                
              </Grid>
              <Grid item xs={12} md={4}>
                <Item>xs=6 md=4</Item>
              </Grid>
              <Grid item xs={12} md={4}>
                <Item>xs=6 md=4</Item>
              </Grid>
            
            </Grid>
          </Box>

    </Container>
    
  );
}
