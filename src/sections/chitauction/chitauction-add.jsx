import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Box, Stack, Alert, Button, Snackbar, Typography, } from '@mui/material';

import { GetHeader, PutHeader, PostHeader, } from 'src/hooks/AxiosApiFetch';

import { CHIT_AUCTION_VIEW, CHIT_AUCTION_SAVE, REACT_APP_HOST_URL, CHIT_AUCTION_UPDATE } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import './chitauction-add.css';

export default function AddChitAuctionPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state;
    const Session = localStorage.getItem('apiToken');
    const [GroupNo, setGroupNo] = useState({
        data: data && data.groupno ? data.groupno : "",
        error: ""
    });
    const [ForemanPrDue, setForemanPrDue] = useState({
        data: "",
        error: ""
    });
    const [Amount, setAmount] = useState({
        data: data && data.amount ? data.amount : "",
        error: ""
    });
    const [Dividend, setDividend] = useState({
        data: "",
        error: ""
    });
    const [Duration, setDuration] = useState({
        data: data && data.duration ? data.duration : "",
        error: ""
    });
    const [Loading, setLoading] = useState(false);
    const [AlertOpen, setAlertOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');
    const [ScreenRefresh, setScreenRefresh] = useState(0);
    // const ImageUrl = JSON.parse(localStorage.getItem('imageUrl'));
    const [ChitAuctionMemberLoading, setChitAuctionMemberLoading] = useState(false);
    const [ChitAuctionList, setChitAuctionList] = useState([]);

    const [SelectAuctionList, setSelectAuctionList] = useState({
        add: 0,
        add_data: '',
        remove: 0,
        remove_data: ''
    });

    useEffect(() => {
        GetChitAuctionView();
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

    const GetChitAuctionView = () => {
        setChitAuctionMemberLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_AUCTION_VIEW}${data.id}`;
        console.log(url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setChitAuctionMemberLoading(false);
                if (json.success) {
                    setChitAuctionList(json.list);
                    setSelectAuctionList({
                        add: 0,
                        add_data: json.list,
                        remove: 0,
                        remove_data: ''
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
                setChitAuctionMemberLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                console.log(error);
            })
    }

    const ChitAuctionAddMethod = (IsValidate) => {
        if (IsValidate){
            setLoading(true);
            const ChitAuctionListParams = {
                "id": 0,
                "group_id": ChitAuctionList[SelectAuctionList.add].group_id,
                "install_no": ChitAuctionList[SelectAuctionList.add].install_no,
                "ticket_no": ChitAuctionList[SelectAuctionList.add].ticket_no,
                "member_id": ChitAuctionList[SelectAuctionList.add].member_id,
                "tkt_suffix": "A",
                "tkt_percentage": "100",
                "is_active": ChitAuctionList[SelectAuctionList.add].is_active,
                "comments": ChitAuctionList[SelectAuctionList.add].comments
            };
            const url = `${REACT_APP_HOST_URL}${CHIT_AUCTION_SAVE}`;
            console.log(JSON.stringify(ChitAuctionListParams) + url);
            console.log(Session);
            fetch(url, PostHeader(JSON.parse(Session), ChitAuctionListParams))
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

    const ChitAuctionUpdateMethod = (IsValidate, id) => {
        if(IsValidate){
            setLoading(true);
            const ChitAuctionListUpdateParams = {
                "id": 0,
                "group_id": ChitAuctionList[SelectAuctionList.add].group_id,
                "install_no": ChitAuctionList[SelectAuctionList.add].install_no,
                "ticket_no": ChitAuctionList[SelectAuctionList.add].ticket_no,
                "member_id": ChitAuctionList[SelectAuctionList.add].member_id,
                "tkt_suffix": "A",
                "tkt_percentage": "100",
                "is_active": ChitAuctionList[SelectAuctionList.add].is_active,
                "comments": ChitAuctionList[SelectAuctionList.add].comments
            };
            const url = `${REACT_APP_HOST_URL}${CHIT_AUCTION_UPDATE}${id}`;
            console.log(JSON.stringify(ChitAuctionListUpdateParams) + url);
            console.log(Session);
            fetch(url, PutHeader(JSON.parse(Session), ChitAuctionListUpdateParams))
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

    const ChitAuctionTextValidate = (e, from) => {
        const text = e.target.value;
        console.log(from);
        if (from === "GroupNo") {
            setGroupNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "ForemanPrDue") {
            setScreenRefresh(pre => pre + 1);
            setForemanPrDue(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "Amount") {
            setAmount(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Dividend") {
            setScreenRefresh(pre => pre + 1);
            setDividend(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "Duration") {
            setDuration(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        }
    };

    const validateChitAuctionInfo = () => {
        let IsValidate = true;
        if (!GroupNo.data) {
            IsValidate = false;
            setGroupNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setGroupNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        /* if (!ForemanPrDue.data) {
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
        } */
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
        /* if (!Dividend.data) {
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
        } */
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
        if (ChitAuctionList.length > 0){
            console.log(SelectAuctionList)
            if (typeof SelectAuctionList.add_data.id === 'string' && SelectAuctionList.add_data.id.includes('id_')){
                ChitAuctionAddMethod(IsValidate);
            }else{
                ChitAuctionUpdateMethod(IsValidate, SelectAuctionList.add_data.id);
            }
        }
    }

    const HandleAlertShow = () => {
        setAlertOpen(true);
    };

    const HandleAlertClose = () => {
        setAlertOpen(false);
        if (AlertFrom === "success") {
            window.location.reload();
            // navigate('/chitauction/list');
        }
    }

    const HandleSubmitClick = () => {
        console.log("submitclick11");
        validateChitAuctionInfo();
    };

    const HandleBack = () => {
        if (ScreenRefresh) {
            const confirmNavigation = window.confirm(
                'You have unsaved changes. Are you sure you want to leave this page?'
            );
            if (confirmNavigation) {
                setScreenRefresh(0);
                navigate('/chitauction/list');
            }
        } else {
            navigate('/chitauction/list');
        }
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    return (
        <Container>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 5, mb: 3 }}>
                    Chit Auction
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
                    {ChitAuctionMemberLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp  grp-label'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Group No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Group No"
                                                value={GroupNo.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "GroupNo")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupNo.error}</div>
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
                                                label="Foreman Pr.Due"
                                                value={ForemanPrDue.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "ForemanPrDue")}
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
                                                label="Amount"
                                                value={Amount.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "Amount")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{Amount.error}</div>
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
                                                label="Dividend"
                                                value={Dividend.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "Dividend")}
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
                                                onChange={(e) => ChitAuctionTextValidate(e, "Duration")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{Duration.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='column' alignItems='flex-end'>
                                <Button sx={{ mr: 5, mt: 2, mb: 3, height: 50, width: 150, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={Loading ? null : HandleSubmitClick}>
                                    {Loading
                                        ? (<img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                        : ("Submit")}
                                </Button>
                            </Stack>
                        </Stack>}
                </Box>
            </Card>
            <Snackbar open={AlertOpen} autoHideDuration={AlertFrom === "save_alert" ? 2000 : 1000} onClose={HandleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    onClose={HandleAlertClose}
                    severity={AlertFrom === "failed" || AlertFrom === "save_alert" ? "error" : "success"}
                    variant="filled"
                    sx={{ width: '100%' }} >
                    {AlertMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}