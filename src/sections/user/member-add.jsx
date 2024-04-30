import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Box, MenuItem } from '@mui/material';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';

import { PostHeader } from 'src/hooks/AxiosApiFetch';

import { REACT_APP_HOST_URL, MEMBER_ADD } from 'src/utils/api-constant';

export default function AddMemberPage() {
   
    const UserDetail = JSON.parse(localStorage.getItem('userDetails'));
    const Session = localStorage.getItem('apiToken');
    const [NamePrefix, setNamePrefix] = useState("");
    const [MemberName, setMemberName] = useState("");
    const [RelationPrefix, setRelationPrefix] = useState("");
    const [Relationship, setRelationship] = useState("");
    const [UsernameError, setUsernameError] = useState("");
    const [Gender, setGender] = useState("");
    const [Dob, setDob] = useState("");
    const [Email, setEmail] = useState("");
    const [PancardNo, setPancardNo] = useState("");
    const [AadharNo, setAadharNo] = useState("");
    const [GuardName, setGuardName] = useState("");
    const [GuardRelationship, setGuardRelationship] = useState("");
    const [WhatsappNo, setWhatsappNo] = useState("");
    const [Loading, setLoading] = useState(false);
    
    const Params = {
        "nameprefix": NamePrefix,
        "name": MemberName,
        "accno": "32",
        "gender": Gender,
        "status": "approved",
        "branchid": 0,
        "dob": Dob,
        "email": Email,
        "pancardno": PancardNo,
        "weddingdate": "",
        "mapped_phone": "",
        "mapped_photo": "",
        "relationship": Relationship,
        "signed_person_desig": "",
        "aadhar_no": AadharNo,
        "guard_name": GuardName,
        "guard_relationship": GuardRelationship,
        "guard_father_or_hus_name": "",
        "guard_mobile_no": "",
        "gst_no": "",
        "relation_prefix": RelationPrefix,
        "area_id": 0,
        "area_name": "",
        "whatsapp_no": WhatsappNo,
        "canvas_agent_id": ""

    }

    const MemberAddMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            const url = REACT_APP_HOST_URL + MEMBER_ADD;
            console.log(JSON.stringify(Params) + url);
            fetch(url, PostHeader(Session, Params))
                .then((response) => response.json())
                .then((json) => {
                    console.log(JSON.stringify(json));
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
        }
    }

    const titles = ["Mr.", "Ms.", "Mrs."];

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
                            style={{ width: 70, marginRight: -18 }}
                        >
                            {titles.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="outlined-required"
                            label="Member Name"
                            defaultValue=""
                            variant="outlined" />
                        <TextField
                            id="outlined-select-currency"
                            select
                            label=""
                            variant="outlined"
                            style={{ width: 70, marginRight: -18 }}
                        >
                            {titles.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            required
                            id="outlined-required"
                            label="Relationhsip" />
                        <TextField
                            required
                            id="outlined-required"
                            label="Gender" />
                        <TextField
                            required
                            id="outlined-required"
                            label="Mobile Number" />
                        <TextField
                            required
                            id="outlined-required"
                            label="DOB" />
                        <TextField
                            required
                            id="outlined-required"
                            label="Email" />
                        <TextField
                            required
                            id="outlined-required"
                            label="Whatsapp Number" />
                        <TextField
                            required
                            id="outlined-required"
                            label="Guardian Name" />
                        <TextField
                            required
                            id="outlined-required"
                            label="Guardian Relation" />
                        <TextField
                            required
                            id="outlined-required"
                            label="Aadhar Number" />
                        <TextField
                            required
                            id="outlined-required"
                            label="Pancard Number" />
                    </div>
                </Box>
            </Card>
        </Container>
    );
}
