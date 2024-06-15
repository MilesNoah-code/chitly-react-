import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Box, Stack, Alert, Button, MenuItem, Snackbar, Typography } from '@mui/material';

import { PutHeader, PostHeader, } from 'src/hooks/AxiosApiFetch';

import { GROUP_SAVE, GROUP_UPDATE, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import './group-add.css';

export default function AddGroupPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state;
    const Session = localStorage.getItem('apiToken');
    const [GroupCode, setGroupCode] = useState({
        data: screen === "add" ? "" : data.groupno,
        error: ""
    });
    const [Amount, setAmount] = useState({
        data: screen === "add" ? "" : data.amount,
        error: ""
    });
    const [Duration, setDuration] = useState({
        data: screen === "add" ? "" : data.duration,
        error: ""
    });
    const [EMDue, setEMDue] = useState({
        data: screen === "add" ? "" : data.emdue,
        error: ""
    });
    const [FMPRDue, setFMPRDue] = useState({
        data: screen === "add" ? "" : data.fmprdue,
        error: ""
    });
    const [Dividend, setDividend] = useState({
        data: screen === "add" ? "" : data.divident_distribute,
        error: ""
    });
    const [AuctionMode, setAuctionMode] = useState({
        data: screen === "add" ? "" : data.auction_mode,
        error: ""
    });

    const AuctionModeArray = ["Weekly", "Monthly", "Monthly Twice", "Monthly Thrice"];
    const DividendArray = ["Current Month", "Next Month"];

    const [Loading, setLoading] = useState(false);
    const [AlertOpen, setAlertOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');
    const [FMPRDUEArray, setFMPRDUEArray] = useState([]);
    const [ScreenRefresh, setScreenRefresh] = useState(0);

    useEffect(() => {
        console.log(data);
        if(screen === "edit" || screen === "view"){
            if (!Number.isNaN(data.duration)) {
                const intValue = parseInt(data.duration, 10);
                const newList = [];
                for (let i = 1; i <= intValue;) {
                    newList.push(i);
                    i += 1;
                }
                setFMPRDUEArray(newList);
            } else {
                setFMPRDUEArray([]);
            }
        }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ScreenRefresh]);

    const GroupInfoParams = {
        "duration": Duration.data,
        "groupno": GroupCode.data,
        "amount": Amount.data,
        "emdue": EMDue.data,
        "auction_mode": AuctionMode.data,
        "branchid": 0,
        "branch_name": "",
        "fmprdue": FMPRDue.data,
        "divident_distribute": Dividend.data,
        "foreman1_id": 0,
        "foreman2_id": 0,
        "foreman3_id": 0,
    }

    const GroupAddMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            let url = '';
            let Params = '';
            url = `${REACT_APP_HOST_URL}${GROUP_SAVE}`;
            Params = GroupInfoParams;
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

    const GroupUpdateMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            let url = '';
            let Params = '';
            url = `${REACT_APP_HOST_URL}${GROUP_UPDATE}${data.id}`;
            Params = GroupInfoParams;
            // console.log(JSON.stringify(Params) + url);
            fetch(url, PutHeader(JSON.parse(Session), Params))
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

    useEffect(() => {
        if (Amount.data !== '' && Duration.data !== '') {
            const amountValue = parseFloat(Amount.data);
            const durationValue = parseFloat(Duration.data);
            if (!Number.isNaN(amountValue) && !Number.isNaN(durationValue) && durationValue !== 0) {
                setEMDue({
                    data: (amountValue / durationValue).toFixed(2), // Displaying with two decimal places
                    error: ''
                });
            } else {
                setEMDue({ data: '', error: '* Invalid Number Entered in Amount or Duration' });
            }
        } else {
            setEMDue({ data: '', error: '' });
        }
    }, [Amount.data, Duration.data]);

    const GroupTextValidate = (e, from) => {
        const text = e.target.value;
        setScreenRefresh(pre => pre + 1);
        // console.log(from);
        if (from === "GroupCode") {
            setGroupCode(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Amount") {
            setAmount(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Duration") {
            if (!Number.isNaN(text)) {
                const intValue = parseInt(text, 10);
                const newList = [];
                for (let i = 1; i <= intValue;) {
                    newList.push(i);
                    i += 1;
                }
                setFMPRDUEArray(newList);
            } else {
                setFMPRDUEArray([]);
            }
            setDuration(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "EMDue") {
            setEMDue(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "FMPRDue") {
            setFMPRDue(prevState => ({
                ...prevState,
                data: text !== "" ? text : "",
                error: text === "" ? "* Required" : ""
            }));
        } else if (from === "Dividend") {
            setDividend(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "AuctionMode") {
            setAuctionMode(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        }
    };

    const validateGroupInfo = () => {
        let IsValidate = true;
        if (!GroupCode.data) {
            IsValidate = false;
            setGroupCode(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setGroupCode(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Amount.data) {
            IsValidate = false;
            setAmount(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAmount(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Duration.data) {
            IsValidate = false;
            setDuration(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setDuration(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!EMDue.data) {
            IsValidate = false;
            setEMDue(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setEMDue(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!FMPRDue.data) {
            IsValidate = false;
            setFMPRDue(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setFMPRDue(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Dividend.data) {
            IsValidate = false;
            setDividend(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setDividend(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!AuctionMode.data) {
            IsValidate = false;
            setAuctionMode(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAuctionMode(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (screen === "add") {
            GroupAddMethod(IsValidate);
        } else {
            GroupUpdateMethod(IsValidate);
        }

    }

    const HandleAlertShow = () => {
        setAlertOpen(true);
    };

    const HandleAlertClose = () => {
        setAlertOpen(false);
        if (AlertFrom === "success") {
            navigate('/group/list');
        }
    };

    const HandleSubmitClick = () => {
        validateGroupInfo();
    };

    const HandleBack = () => {
        if (ScreenRefresh) {
            const confirmNavigation = window.confirm(
                'You have unsaved changes. Are you sure you want to leave this page?'
            );
            if (confirmNavigation) {
                setScreenRefresh(0);
                navigate('/group/list');
            }
        } else {
            navigate('/group/list');
        }
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    const screenLabel = {
        add: "Add Group",
        view: "View Group",
        edit: "Edit Group",
    };

    return (
        <Container>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 5, mb: 3 }}>
                    {screenLabel[screen] || "Add Group"}
                </Typography>
                <Button variant="contained" className='custom-button' onClick={HandleBack} sx={{ cursor: 'pointer' }}>
                    Back
                </Button>
            </Stack>
            <Card>
                <Box className="con" component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 2, width: '20ch', },
                    }}
                    noValidate
                    autoComplete="off">
                    <Stack direction='column' >
                        <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                        Group Code
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            className='input-box1'
                                            required
                                            id="outlined-required"
                                            disabled={screen === "view"}
                                            label="Group Code"
                                            value={GroupCode.data}
                                            onChange={(e) => GroupTextValidate(e, "GroupCode")}
                                            style={{}} />
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupCode.error}</div>
                                </Stack>
                            </div>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                        Amount
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            className='input-box1'
                                            required
                                            id="outlined-required"
                                            disabled={screen === "view"}
                                            label="Amount"
                                            value={Amount.data}
                                            onChange={(e) => GroupTextValidate(e, "Amount")}
                                            style={{}} />
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Amount.error}</div>
                                </Stack>
                            </div>
                        </Stack>
                        <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                        Duration
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            className='input-box1'
                                            required
                                            id="outlined-required"
                                            disabled={screen === "view"}
                                            label="Duration"
                                            value={Duration.data}
                                            onChange={(e) => GroupTextValidate(e, "Duration")}
                                            style={{}} />
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Duration.error}</div>
                                </Stack>
                            </div>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                        EM Due
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            className='input-box1'
                                            required
                                            id="outlined-required"
                                            disabled
                                            label="EM Due"
                                            value={EMDue.data}
                                            onChange={(e) => GroupTextValidate(e, "EMDue")}
                                            style={{}} />
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{EMDue.error}</div>
                                </Stack>
                            </div>
                        </Stack>
                        <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                        FM. PR. Due
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            select
                                            disabled={screen === "view"}
                                            label="Select"
                                            value={FMPRDue.data}
                                            onChange={(e) => GroupTextValidate(e, "FMPRDue")}
                                            style={{}}>
                                            {FMPRDUEArray.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>))}
                                        </TextField>
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{FMPRDue.error}</div>
                                </Stack>
                            </div>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                        Dividend
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            select
                                            disabled={screen === "view"}
                                            label="Select"
                                            value={Dividend.data}
                                            onChange={(e) => GroupTextValidate(e, "Dividend")}
                                            style={{}}>
                                            {DividendArray.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>))}
                                        </TextField>
                                    </Stack>
                                </Stack>
                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Dividend.error}</div>
                            </div>
                        </Stack>
                        <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                        Auction Mode
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-select-currency"
                                            select
                                            disabled={screen === "view"}
                                            label="Select"
                                            variant="outlined"
                                            value={AuctionMode.data}
                                            onChange={(e) => GroupTextValidate(e, "AuctionMode")}
                                            style={{}}>
                                            {AuctionModeArray.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{AuctionMode.error}</div>
                                </Stack>
                            </div>
                        </Stack>
                        {screen === "view"
                            ? null
                            : <Stack direction='column' alignItems='flex-end'>
                                <Button sx={{ mr: 5, mb: 3, height: 50, width: 150, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={Loading ? null : HandleSubmitClick}>
                                    {Loading
                                        ? (<img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                        : ("Submit")}
                                </Button>
                            </Stack>}
                    </Stack>
                </Box>
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