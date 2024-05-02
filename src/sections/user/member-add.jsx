import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Box, Button, MenuItem } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { PostHeader } from 'src/hooks/AxiosApiFetch';

import { isValidEmail } from 'src/utils/Validator';
import { MEMBER_ADD, REACT_APP_HOST_URL } from 'src/utils/api-constant';

export default function AddMemberPage() {
   
    const router = useRouter();
    const UserDetail = JSON.parse(localStorage.getItem('userDetails'));
    const Session = localStorage.getItem('apiToken');
    const [NamePrefix, setNamePrefix] = useState({
        data: "",
        error: ""
    });
    const [MemberName, setMemberName] = useState({
        data: "",
        error: ""
    });
    const [RelationPrefix, setRelationPrefix] = useState({
        data: "",
        error: ""
    });
    const [Relationship, setRelationship] = useState({
        data: "",
        error: ""
    });
    const [Gender, setGender] = useState({
        data: "",
        error: ""
    });
    const [MobileNumber, setMobileNumber] = useState({
        data: "",
        error: ""
    });
    const [Dob, setDob] = useState({
        data: "",
        error: ""
    });
    const [Email, setEmail] = useState({
        data: "",
        error: ""
    });
    const [PancardNo, setPancardNo] = useState({
        data: "",
        error: ""
    });
    const [AadharNo, setAadharNo] = useState({
        data: "",
        error: ""
    });
    const [GuardName, setGuardName] = useState({
        data: "",
        error: ""
    });
    const [GuardRelationship, setGuardRelationship] = useState({
        data: "",
        error: ""
    });
    const [WhatsappNo, setWhatsappNo] = useState({
        data: "",
        error: ""
    });
    const [Loading, setLoading] = useState(false);
    
    const Params = {
        "nameprefix": NamePrefix.data,
        "name": MemberName.data,
        "accno": "",
        "gender": Gender.data,
        "status": "",
        "branchid": 0,
        "dob": Dob.data,
        "email": Email.data,
        "pancardno": PancardNo.data,
        "weddingdate": "",
        "mapped_phone": MobileNumber.data,
        "mapped_photo": "",
        "relationship": Relationship.data,
        "signed_person_desig": "",
        "aadhar_no": AadharNo.data,
        "guard_name": GuardName.data,
        "guard_relationship": GuardRelationship.data,
        "guard_father_or_hus_name": "",
        "guard_mobile_no": "",
        "gst_no": "",
        "relation_prefix": RelationPrefix.data,
        "area_id": 0,
        "area_name": "",
        "whatsapp_no": WhatsappNo.data,
        "canvas_agent_id": ""

    }

    const MemberAddMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            const url = REACT_APP_HOST_URL + MEMBER_ADD;
            console.log(JSON.stringify(Params) + url);
            console.log(Session);
            fetch(url, PostHeader(JSON.parse(Session), Params))
                .then((response) => response.json())
                .then((json) => {
                    console.log(JSON.stringify(json));
                    setLoading(false);
                    if (json.success) {
                        router.push('/user');
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
        }
    }

    const Prefix = ["Mr.", "Mrs.", "Miss", "Ms."];
    const GenderArray = ["Male", "Female", "Other"];

    const TextValidate = (e, from) => {
        const text = e.target.value;
        console.log(from);
        if (from === "NamePrefix"){
            setNamePrefix(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "MemberName"){
            setMemberName(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "RelationPrefix"){
            setRelationPrefix(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Relationship"){
            setRelationship(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Gender"){
            setGender(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" || text.trim() === "Select" ? "* Required" : ""
            }));
        } else if (from === "MobileNumber"){
            setMobileNumber(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Dob"){
            setDob(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Email"){
            setEmail(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : (isValidEmail(text) ? "" : "* Invalid Email")
            }));
        } else if (from === "WhatsappNo"){
            setWhatsappNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "GuardName"){
            setGuardName(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "GuardRelationship"){
            setGuardRelationship(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "AadharNo"){
            setAadharNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "PancardNo"){
            setPancardNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        }
    };

    const validateForm = () => {
        let IsValidate = true;
        if (!NamePrefix.data) {
            IsValidate = false;
            setNamePrefix(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setNamePrefix(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!MemberName.data) {
            IsValidate = false;
            setMemberName(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setMemberName(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!RelationPrefix.data) {
            IsValidate = false;
            setRelationPrefix(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setRelationPrefix(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Relationship.data) {
            IsValidate = false;
            setRelationship(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setRelationship(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Gender.data) {
            IsValidate = false;
            setGender(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setGender(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!MobileNumber.data) {
            IsValidate = false;
            setMobileNumber(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setMobileNumber(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Dob.data) {
            IsValidate = false;
            setDob(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setDob(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Email.data) {
            IsValidate = false;
            setEmail(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else if (!isValidEmail(Email.data)) {
            IsValidate = false;
            setEmail(prevState => ({
                ...prevState,
                error: "* Invalid Email"
            }));
        } else {
            setEmail(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!WhatsappNo.data) {
            IsValidate = false;
            setWhatsappNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setWhatsappNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!GuardName.data) {
            IsValidate = false;
            setGuardName(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setGuardName(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!GuardRelationship.data) {
            IsValidate = false;
            setGuardRelationship(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setGuardRelationship(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!AadharNo.data) {
            IsValidate = false;
            setAadharNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAadharNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!PancardNo.data) {
            IsValidate = false;
            setPancardNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setPancardNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        MemberAddMethod(IsValidate);
    }

    return (
        <Container>
            <Card>
                <Box component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch', margin: 3 },
                    }}
                    noValidate
                    autoComplete="off">
                    <div>
                        <TextField
                            id="outlined-select-currency"
                            select
                            label=""
                            variant="outlined"
                            value={NamePrefix.data}
                            onChange={(e) => TextValidate(e, "NamePrefix")}
                            style={{ width: 90, marginRight: -18 }} >
                            {Prefix.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="outlined-required"
                            label="Member Name"
                            variant="outlined"
                            value={MemberName.data}
                            onChange={(e) => TextValidate(e, "MemberName")} />
                        <div style={{  marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px"  }}>{MemberName.error || NamePrefix.error}</div>
                        <TextField
                            id="outlined-select-currency"
                            select
                            label=""
                            variant="outlined"
                            value={RelationPrefix.data}
                            onChange={(e) => TextValidate(e, "RelationPrefix")}
                            style={{ width: 90, marginRight: -18 }} >
                            {Prefix.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            required
                            id="outlined-required"
                            label="Relationhsip"
                            value={Relationship.data}
                            onChange={(e) => TextValidate(e, "Relationship")} />
                        <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Relationship.error || RelationPrefix.error}</div>
                        <TextField
                            id="outlined-select-currency"
                            select
                            label="Select"
                            variant="outlined"
                            value={Gender.data}
                            onChange={(e) => TextValidate(e, "Gender")} >
                            {GenderArray.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Gender.error}</div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Mobile Number"
                            value={MobileNumber.data}
                            onChange={(e) => TextValidate(e, "MobileNumber")} />
                        <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{MobileNumber.error}</div>
                        <TextField
                            required
                            id="outlined-required"
                            label="DOB"
                            value={Dob.data}
                            onChange={(e) => TextValidate(e, "Dob")} />
                        <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Dob.error}</div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Email"
                            value={Email.data}
                            onChange={(e) => TextValidate(e, "Email")} />
                        <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Email.error}</div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Whatsapp Number"
                            value={WhatsappNo.data}
                            onChange={(e) => TextValidate(e, "WhatsappNo")} />
                        <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{WhatsappNo.error}</div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Guardian Name"
                            value={GuardName.data}
                            onChange={(e) => TextValidate(e, "GuardName")} />
                        <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GuardName.error}</div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Guardian Relation"
                            value={GuardRelationship.data}
                            onChange={(e) => TextValidate(e, "GuardRelationship")} />
                        <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GuardRelationship.error}</div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Aadhar Number"
                            value={AadharNo.data}
                            onChange={(e) => TextValidate(e, "AadharNo")} />
                        <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{AadharNo.error}</div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Pancard Number"
                            value={PancardNo.data}
                            onChange={(e) => TextValidate(e, "PancardNo")} />
                        <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{PancardNo.error}</div>
                        <Button style={{margin: "20px" }} variant="contained" color="inherit" onClick={validateForm}>
                            {Loading
                                ? (<img src="../../../public/assets/icons/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                : ("Submit")}
                        </Button>
                    </div>
                    
                </Box>
            </Card>
        </Container>
    );
}
