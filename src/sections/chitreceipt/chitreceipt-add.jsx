import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Box, Stack, Button, Dialog, IconButton, Typography } from '@mui/material';

import { GetHeader, PostHeader, } from 'src/hooks/AxiosApiFetch';

import { CHIT_RECEIPT_SAVE, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

export default function AddChitReceiptPage() {
   
    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state;
    const Session = localStorage.getItem('apiToken');
    const [ReceiptNo, setReceiptNo] = useState({
        data: screen === "add" ? "" : data.groupno,
        error: ""
    });
    const [TicketNo, setTicketNo] = useState({
        data: screen === "add" ? "" : data.amount,
        error: ""
    });
    const [AuctionMode, setAuctionMode] = useState({
        data: screen === "add" ? "" : data.duration,
        error: ""
    });
    const [Duration, setDuration] = useState({
        data: screen === "add" ? "" : data.emdue,
        error: ""
    });
    const [AccountNo, setAccountNo] = useState({
        data: screen === "add" ? "" : data.fmprdue,
        error: ""
    });
    const [InstFrom, setInstFrom] = useState({
        data: screen === "add" ? "" : data.fmprdue,
        error: ""
    });
    const [InstTo, setInstTo] = useState({
        data: screen === "add" ? "" : data.divident_distribute,
        error: ""
    });
    const [Values, setValues] = useState({
        data: screen === "add" ? "" : data.divident_distribute,
        error: ""
    });


    const [Loading, setLoading] = useState(false);
    const [GroupListLoading, setGroupListLoading] = useState(false);
    const [Alert, setAlert] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');
    
    const ChitReceiptInfoParams = {
        "duration": AuctionMode.data,
        "groupno": ReceiptNo.data,
        "amount": TicketNo.data,
        "emdue": Duration.data,
        "auction_mode": AuctionMode.data,
        "branchid": 0,
        "branch_name": "",
        "fmprdue": InstFrom.data,
        "divident_distribute": InstTo.data,
        "foreman1_id": 0,
        "foreman2_id": 0,
        "foreman3_id": 0,
    }

    const ChitReceiptAddMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            let url = '';
            let Params = '';
            url = REACT_APP_HOST_URL + CHIT_RECEIPT_SAVE;
            Params = ChitReceiptInfoParams;
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

    const ChitReceiptTextValidate = (e, from) => {
        const text = e.target.value;
        console.log(from);
        if (from === "ReceiptNo"){
            setReceiptNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "TicketNo"){
            setTicketNo(prevState => ({
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
        } else if (from === "Duration"){
            setDuration(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "AccountNo") {
            setAccountNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "InstFrom"){
            setInstFrom(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "InstTo"){
            setInstTo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Values"){
            setValues(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        }
    };

    const validateChitReceiptInfo = () => {
        let IsValidate = true;
        if (!ReceiptNo.data) {
            IsValidate = false;
            setReceiptNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setReceiptNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!TicketNo.data) {
            IsValidate = false;
            setTicketNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setTicketNo(prevState => ({
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
        if (!AccountNo.data) {
            IsValidate = false;
            setAccountNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAccountNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!InstFrom.data) {
            IsValidate = false;
            setInstFrom(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setInstFrom(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!InstTo.data) {
            IsValidate = false;
            setInstTo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setInstTo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Values.data) {
            IsValidate = false;
            setValues(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setValues(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if(screen === "add"){
            ChitReceiptAddMethod(IsValidate);
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
        validateChitReceiptInfo();
    };

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    return (
        <Container>
        <Stack direction='row' spacing={2} alignItems='center' justifyContent={'space-between'} sx={{mt:2, mb:2}}>
        <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 5, mb: 3 }}>
                    {screen === "add" ? "Add Chit Receipt" : (screen === "view" ? "View Chit Receipt" : "Edit Chit Receipt")}
                </Typography>
                <Button variant="contained" className='custom-button'  onClick={() => navigate('/chitreceipt')}>
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
                    {GroupListLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="../../../public/assets/icons/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                        Receipt No
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled={screen === "view" ? true : false}
                                            label="Receipt No"
                                            value={ReceiptNo.data}
                                            onChange={(e) => ChitReceiptTextValidate(e, "ReceiptNo")}
                                            style={{ }} />
                                       
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{ReceiptNo.error}</div>
                                </Stack>
                                </div>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                        Ticket No
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                        className='input-box1'
                                            required
                                            id="outlined-required"
                                            disabled={screen === "view" ? true : false}
                                            label="Ticket No"
                                            value={TicketNo.data}
                                            onChange={(e) => ChitReceiptTextValidate(e, "TicketNo")}
                                            style={{  }} />
                                      
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{TicketNo.error}</div>
                                </Stack>
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
                                            id="outlined-required"
                                            disabled={screen === "view" ? true : false}
                                            label="Auction Mode"
                                            value={AuctionMode.data}
                                            onChange={(e) => ChitReceiptTextValidate(e, "AuctionMode")}
                                            style={{  }} />
                                       
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{AuctionMode.error}</div>
                                </Stack>
                                </div>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1'  sx={{mt: 2, ml: 2 }} >
                                        Duration
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled={screen === "view" ? true : false}
                                            label="Duration"
                                            value={Duration.data}
                                            onChange={(e) => ChitReceiptTextValidate(e, "Duration")}
                                            style={{  }} />
                                      
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Duration.error}</div>
                                </Stack>
                             
                                </div>
                                </Stack>

                                <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }} >
                                        Account No
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled={screen === "view" ? true : false}
                                            label="Account No"
                                            value={AccountNo.data}
                                            onChange={(e) => ChitReceiptTextValidate(e, "AccountNo")}
                                            style={{  }} />
                                      
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{AccountNo.error}</div>
                                </Stack>
                           </div>
                           <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{mt: 2, ml: 2 }}>
                                        Inst. From
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled={screen === "view" ? true : false}
                                            label="Inst. From"
                                            value={InstFrom.data}
                                            onChange={(e) => ChitReceiptTextValidate(e, "InstFrom")}
                                            style={{  }} />
                                        
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{InstFrom.error}</div>
                                </Stack>
                                </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}  >
                                        Inst. To
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled={screen === "view" ? true : false}
                                            label="Inst. To"
                                            value={InstTo.data}
                                            onChange={(e) => ChitReceiptTextValidate(e, "InstTo")}
                                            style={{ }} />
                                       
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{InstTo.error}</div>
                                </Stack>
                                </div>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                        Value
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled={screen === "view" ? true : false}
                                            label="Value"
                                            value={Values.data}
                                            onChange={(e) => ChitReceiptTextValidate(e, "Values")}
                                            style={{  }} />
                                      
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Values.error}</div>
                                </Stack>
                                </div>
                            </Stack>
                            {screen === "view"
                                ? null
                                :<Stack direction='column' alignItems='flex-end'>
                                        <Button sx={{ mr: 5, mt:2, mb: 3, height: 50, width: 150 }} variant="contained" className='custom-button'  onClick={HandleSubmitClick}>
                                            {Loading
                                                ? (<img src="../../../public/assets/icons/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                                : ("Submit")}
                                        </Button>
                                    </Stack>}
                        </Stack>}
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