import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Box, Stack, Button, Dialog, MenuItem, IconButton, Typography } from '@mui/material';

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

    const [Loading, setLoading] = useState(false);
    const [Alert, setAlert] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');

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
            console.log(JSON.stringify(Params) + url);
            console.log(Session);
            fetch(url, PostHeader(JSON.parse(Session), Params))
                .then((response) => response.json())
                .then((json) => {
                    console.log(JSON.stringify(json));
                    setLoading(false);
                    if (json.success) {
                        setAlertMessage(json.message);
                        setAlertFrom("success");
                        HandleAlertShow();
                    }else if(json.success === false){
                        setAlertMessage(json.message);
                        setAlertFrom("failed");
                        HandleAlertShow();
                    }else{
                        setErrorAlert(true);
                        setErrorScreen("network");
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    setErrorAlert(true);
                    setErrorScreen("error");
                    console.log(error);
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
            console.log(JSON.stringify(Params) + url);
            console.log(Session);
            fetch(url, PutHeader(JSON.parse(Session), Params))
                .then((response) => response.json())
                .then((json) => {
                    console.log(JSON.stringify(json));
                    setLoading(false);
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
                    console.log(error);
                })
        }
    }

    const GroupTextValidate = (e, from) => {
        const text = e.target.value;
        console.log(from);
        if (from === "GroupCode"){
            setGroupCode(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Amount"){
            setAmount(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Duration"){
            setDuration(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "EMDue"){
            setEMDue(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "FMPRDue"){
            setFMPRDue(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Dividend"){
            setDividend(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "AuctionMode"){
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
        if(screen === "add"){
            GroupAddMethod(IsValidate);
        }else{
            GroupUpdateMethod(IsValidate);
        }
    
    }

    const HandleAlertShow = () => {
        setAlert(true);
    };

    const HandleAlertClose = () => {
        setAlert(false);
        if (AlertFrom === "success"){
            window.location.reload();
        }
    };

    const HandleSubmitClick = () => {
        console.log("submitclick11");
        validateGroupInfo();
    };

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    const screenLabel = {
        add: "Add Group",
        view: "View Group",
        edit: "Edit Group",
    };

    return (
        <Container>
        <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{mt:2, mb:2}}>
        <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 5, mb: 3 }}>
                    {screenLabel[screen] || "Add Group"}
    </Typography>
    <Button variant="contained" className='custom-button'  onClick={() => navigate('/group')}>
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
                                    <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
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
                                            style={{ }} />
                                      
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupCode.error}</div>
                                </Stack>
                                </div>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
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
                                            style={{  }} />
                                       
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Amount.error}</div>
                                </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
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
                                            style={{  }} />
                                      
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Duration.error}</div>
                                </Stack>
                                </div>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                        EM Due
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                        className='input-box1'
                                            required
                                            id="outlined-required"
                                            disabled={screen === "view"}
                                            label="EM Due"
                                            value={EMDue.data}
                                            onChange={(e) => GroupTextValidate(e, "EMDue")}
                                            style={{  }} />
                                      
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{EMDue.error}</div>
                                </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                        FM. PR. Due
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled={screen === "view"}
                                            label="FM. PR. Due"
                                            value={FMPRDue.data}
                                            onChange={(e) => GroupTextValidate(e, "FMPRDue")}
                                            style={{  }} />
                                       
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{FMPRDue.error}</div>
                                </Stack>
                                </div>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                        Dividend
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled={screen === "view"}
                                            label="Dividend"
                                            value={Dividend.data}
                                            onChange={(e) => GroupTextValidate(e, "Dividend")}
                                            style={{  }} />
                                       
                                    </Stack>
                                   
                                </Stack>
                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Dividend.error}</div>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
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
                                            style={{  }}>
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
                                :<Stack direction='column' alignItems='flex-end'>
                                        <Button sx={{ mr: 5, mb: 3, height: 50, width: 150 }} variant="contained" className='custom-button' onClick={HandleSubmitClick}>
                                            {Loading
                                                ? (<img src="../../../public/assets/icons/list_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                                : ("Submit")}
                                        </Button>
                                    </Stack>}
                        </Stack>
                </Box>
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
                    sx={{ position: 'absolute', right: 15, top: 20, color: (theme) => theme.palette.grey[500], }} >
                    <img src="../../../public/assets/icons/cancel.png" alt="Loading" style={{ width: 17, height: 17, }} />
                </IconButton>
                <Stack style={{ alignItems: 'center', }} mt={5}>
                    {AlertFrom === "success"
                        ? <img src="../../../public/assets/icons/success_gif.gif" alt="Loading" style={{ width: 130, height: 130, }} />
                        : <img src="../../../public/assets/icons/failed_gif.gif" alt="Loading" style={{ width: 130, height: 130, }} />}
                    <Typography gutterBottom variant='h6' className="alert-msg" mt={2} mb={5} color={AlertFrom === "success" ? "#45da81" : "#ef4444"}>
                        {AlertMessage}
                    </Typography>
                </Stack>
            </Dialog>
        </Container>
    );
}