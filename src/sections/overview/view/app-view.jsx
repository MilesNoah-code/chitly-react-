import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Alert, Stack, Snackbar } from '@mui/material';

import { GetHeader, } from 'src/hooks/AxiosApiFetch';

import { DASHBOARD_COUNT, ACTIVITY_LOG_LIST, REACT_APP_HOST_URL, CUSTOMER_COUNT_BASED_GROUP } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import AppOrderTimeline from '../app-order-timeline';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';

export default function AppView() {

  const Session = localStorage.getItem('apiToken');
  const [AlertOpen, setAlertOpen] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertFrom, setAlertFrom] = useState('');
  const [ErrorAlert, setErrorAlert] = useState(false);
  const [ErrorScreen, setErrorScreen] = useState('');
  const [DashBoardCount, setDashBoardCount] = useState({});
  const [DashBoardCountLoading, setDashBoardCountLoading] = useState(false);
  const [ActivityLogList, setActivityLogList] = useState([]);
  const [ActivityLogListLoading, setActivityLogListLoading] = useState(false);
  const [CustomerCountBasedGroupList, setCustomerCountBasedGroupList] = useState([]);
  const [CustomerCountBasedGroupListLoading, setCustomerCountBasedGroupListLoading] = useState(false);

  useEffect(() => {
    GetDashBoardCount();
    GetActivityLogList();
    GetDashBoardChartList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetDashBoardCount = () => {
    setDashBoardCountLoading(true);
    const url = `${REACT_APP_HOST_URL}${DASHBOARD_COUNT}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setDashBoardCountLoading(false);
        if (json.success) {
          setDashBoardCount(json);
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
        setDashBoardCountLoading(false);
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
      })
  }

  const GetActivityLogList = () => {
    setActivityLogListLoading(true);
    const url = `${REACT_APP_HOST_URL}${ACTIVITY_LOG_LIST}start=0&limit=4`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setActivityLogListLoading(false);
        if (json.success) {
          setActivityLogList(json.list);
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
        setActivityLogListLoading(false);
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
      })
  }

  const GetDashBoardChartList = () => {
    setCustomerCountBasedGroupListLoading(true);
    const url = `${REACT_APP_HOST_URL}${CUSTOMER_COUNT_BASED_GROUP}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setCustomerCountBasedGroupListLoading(false);
        if (json.success) {
          setCustomerCountBasedGroupList(json.list);
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
        setCustomerCountBasedGroupListLoading(false);
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
      })
  }

  const HandleAlertShow = () => {
    setAlertOpen(true);
  };

  const HandleAlertClose = () => {
    setAlertOpen(false);
    if (AlertFrom === "success") {
      window.location.reload();
    }
  }

  const labels = CustomerCountBasedGroupList.map(item => `Rs.${item.amount}`);
  const series = [
    {
      name: 'Members Count',
      type: 'bar',
      fill: 'solid',
      data: CustomerCountBasedGroupList.map(item => item.membersCount)
    }
  ];

  const chartData = {
    labels,
    series
  };

  if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>
      {ActivityLogListLoading || DashBoardCountLoading || CustomerCountBasedGroupListLoading
        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
          <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
        </Stack>
        : <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Number of Customers"
              total={DashBoardCount && DashBoardCount.memberCount ? DashBoardCount.memberCount : "0"}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/dashboard_member.png" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Number of Active Groups"
              total={DashBoardCount && DashBoardCount.groupCount ? DashBoardCount.groupCount : "0"}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/dashboard_group.png" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Receipt this Month"
              total={DashBoardCount && DashBoardCount.receiptCount ? DashBoardCount.receiptCount : "0"}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/dashboard_receipt.png" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Payment this Month"
              total={DashBoardCount && DashBoardCount.paymentCount ? DashBoardCount.paymentCount : "0"}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/dashboard_payment.png" />}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Chit Amount Based Customers Count"
              chart={chartData}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Recent Activities"
              list={ActivityLogList}
            />
          </Grid>
        </Grid>}
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
    </Container>
  );
}
