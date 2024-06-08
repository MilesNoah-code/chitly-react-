import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Box, Stack, Alert, Button, ListItem, Snackbar, Typography, Autocomplete, ListItemText } from '@mui/material';

import { GetHeader, PostHeader, } from 'src/hooks/AxiosApiFetch';

import { CHIT_RECEIPT_SAVE, REACT_APP_HOST_URL, CHIT_RECEIPT_DETAIL, } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import './chitestimate-add.css';

export default function AddChitEstimatePage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state;
    const Session = localStorage.getItem('apiToken');
    const [GroupNoSearch, setGroupNoSearch] = useState({
        data: "",
        error: ""
    });
    const [ForemanPrDue, setForemanPrDue] = useState({
        data: "",
        error: ""
    });
    const [AuctionMode, setAuctionMode] = useState({
        data: "",
        error: ""
    });
    const [Dividend, setDividend] = useState({
        data: "",
        error: ""
    });
    const [Duration, setDuration] = useState({
        data: "",
        error: ""
    });
    const [Loading, setLoading] = useState(false);
    const [GroupListLoading, setGroupListLoading] = useState(false);
    const [AlertOpen, setAlertOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');
    const [PendingGroupList, setPendingGroupList] = useState([]);
    
    const [ScreenRefresh, setScreenRefresh] = useState(0);

    useEffect(() => {
        if (screen === "view") {
            GetChitReceiptView();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen]);

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

    const GetChitReceiptView = () => {
        setGroupListLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_DETAIL}${data.id}`;
        console.log(url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setGroupListLoading(false);
                if (json.success) {
                    setGroupNoSearch({
                        data: json.list.groupno != null ? json.list.groupno : "",
                        error: ""
                    });
                    setDividend({
                        data: json.list.Dividend != null ? json.list.Dividend : "",
                        error: ""
                    });
                    setForemanPrDue({
                        data: json.list.ForemanPrDue != null ? json.list.ForemanPrDue : "",
                        error: ""
                    });
                    setAuctionMode({
                        data: json.list.auction_mode != null ? json.list.auction_mode : "",
                        error: ""
                    });
                    setDuration({
                        data: json.list.duration != null ? json.list.duration : "",
                        error: ""
                    });
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
                console.log(error);
            })
    }

    const ChitReceiptInfoParams = {
        "groupid": 0,
        "Instno": 0,
        "auctiondate": "",
        "dueamount": "",
        "payment": "",
        "startpercentage": "",
        "calcpercentage": "",
        "less_amount": "",
        "area_id": "",
        "gst_value": "",
        "doc_charge_value": "",
        "is_blocked": "",
        "online_flag": "",
        "fm_commission": "",
    }

    const ChitReceiptAddMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            let url = '';
            let Params = '';
            url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_SAVE}`;
            Params = ChitReceiptInfoParams;
            console.log(JSON.stringify(Params) + url);
            console.log(Session);
            fetch(url, PostHeader(JSON.parse(Session), Params))
                .then((response) => response.json())
                .then((json) => {
                    console.log(JSON.stringify(json));
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
                    console.log(error);
                })
        }
    }

    const ChitReceiptTextValidate = (e, from) => {
        const text = e.target.value;
        setScreenRefresh(pre => pre + 1);
        console.log(from);
        if (from === "AuctionMode") {
            setAuctionMode(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "Dividend") {
            setDividend(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Duration") {
            setDuration(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        }
    };

    const validateChitReceiptInfo = () => {
        let IsValidate = true;
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
        if (!GroupNoSearch.data) {
            IsValidate = false;
            setGroupNoSearch(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setGroupNoSearch(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!ForemanPrDue.data) {
            IsValidate = false;
            setForemanPrDue(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setForemanPrDue(prevState => ({
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
        if (Duration.data == null || Duration.data === "" || Duration.data > 0) {
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
        if (screen === "add") {
            ChitReceiptAddMethod(IsValidate);
        }
    }

    const isValidNumber = (input) => {
        const num = parseFloat(input);
        // Check if the input is not a number, or if it starts with '0.'
        if (Number.isNaN(num) || /^0\.\d+$/.test(input)) {
            return false;
        }
        // Check if the number is positive
        return num > 0;
    };

    const isValidateAmount = (input, specifiedAmount) => {
        const num = parseFloat(input);
        return !Number.isNaN(num) && num <= specifiedAmount;
    };

    const HandleAlertShow = () => {
        setAlertOpen(true);
    };

    const HandleAlertClose = () => {
        setAlertOpen(false);
        if (AlertFrom === "success") {
            navigate('/chitestimate/list');
        }
    }

    const HandleSubmitClick = () => {
        console.log("submitclick11");
        validateChitReceiptInfo();
    };

    const HandleGroupNoSearch = (event, value) => {
        if (value) {
            setScreenRefresh(pre => pre + 1);
            setGroupNoSearch({
                data: value,
                error: ""
            });
            console.log(value);
            setAuctionMode({
                data: value.auction_mode !== "" && value.auction_mode != null ? value.auction_mode : "",
                error: ""
            });
            setDuration({
                data: value.duration !== "" && value.duration != null ? value.duration : "",
                error: ""
            });
        } else {
            setScreenRefresh(0);
            setGroupNoSearch({
                data: "",
                error: ""
            });
            setAuctionMode({
                data: "",
                error: ""
            });
            setDuration({
                data: "",
                error: ""
            });
            setDividend({
                data: "",
                error: ""
            });
            setForemanPrDue({
                data: "",
                error: ""
            });
        }
    }

    const HandleBack = () => {
        if (ScreenRefresh) {
            const confirmNavigation = window.confirm(
                'You have unsaved changes. Are you sure you want to leave this page?'
            );
            if (confirmNavigation) {
                setScreenRefresh(0);
                navigate('/chitestimate/list');
            }
        } else {
            navigate('/chitestimate/list');
        }
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    const screenLabel = {
        add: "Add Chit Estimate",
        view: "View Chit Estimate",
        edit: "Edit Chit Estimate",
    };

    return (
        <Container>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 5, mb: 3 }}>
                    {screenLabel[screen] || "Add Chit Estimate"}
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
                    {GroupListLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="../../../public/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp  grp-label'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Group No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <Autocomplete
                                                className='input-box1'
                                                disablePortal
                                                id="combo-box-demo"
                                                options={PendingGroupList}
                                                disabled={screen === "view"}
                                                getOptionLabel={(option) => option.groupno}
                                                onChange={HandleGroupNoSearch}
                                                sx={{}}
                                                renderOption={(props, option) => (
                                                    <ListItem {...props} key={option.id}>
                                                        <ListItemText
                                                            primary={option.groupno}
                                                            secondary={`${option.auction_mode},  ${Math.round(option.amount)}`} />
                                                    </ListItem>
                                                )}
                                                renderInput={(params) => <TextField {...params} label={screen === "view" ? GroupNoSearch.data : "Search"} />}
                                            />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupNoSearch.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                            Foreman Pr.Due
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Auction Mode"
                                                value={ForemanPrDue.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "ForemanPrDue")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{ForemanPrDue.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Amount
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Member Name"
                                                value={AuctionMode.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "AuctionMode")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{AuctionMode.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Dividend
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Receipt No"
                                                value={Dividend.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "Dividend")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{Dividend.error}</div>
                                    </Stack>
                                </div>

                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                            Duration
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input-box1'
                                                // required
                                                id="outlined-required"
                                                disabled
                                                label="Duration"
                                                value={Duration.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "Duration")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{Duration.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            {screen === "view"
                                ? null
                                : <Stack direction='column' alignItems='flex-end'>
                                    <Button sx={{ mr: 5, mt: 2, mb: 3, height: 50, width: 150, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={Loading ? null : HandleSubmitClick}>
                                        {Loading
                                            ? (<img src="../../../public/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                            : ("Submit")}
                                    </Button>
                                </Stack>}
                        </Stack>}
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