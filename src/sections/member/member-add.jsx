
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import dayjs from 'dayjs';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Tab, Radio, Stack, Button, Dialog, MenuItem, RadioGroup, IconButton, Typography, FormControlLabel } from '@mui/material';

import { GetHeader, PutHeader, PostHeader, DeleteHeader, PostImageHeader } from 'src/hooks/AxiosApiFetch';

import { isValidEmail } from 'src/utils/Validator';
import { MEMBER_ADD, MEMBER_VIEW, MEMBER_UPDATE, MEMBER_MEDIA_LIST, REACT_APP_HOST_URL, MEMBER_ADDRESS_SAVE, MEMBER_IMAGE_UPLOAD, MEMBER_MEDIA_DELETE, MEMBER_ADDRESS_UPDATE, MEMBER_BANK_DETAIL_SAVE, MEMBER_BANK_DETAIL_UPDATE, MEMBER_EDUCATION_DETAIL_SAVE, MEMBER_OCCUPATION_DETAIL_SAVE, MEMBER_EDUCATION_DETAIL_UPDATE, MEMBER_OCCUPATION_DETAIL_UPDATE } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import './member-add.css';
import Iconify from 'src/components/iconify';
export default function AddMemberPage() {
   
    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state;
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
        data: null,
        datesave: "",
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
    const [ProfileImage, setProfileImage] = useState({
        data: "",
        error: ""
    });
    const [Loading, setLoading] = useState(false);
    const [MemberLoading, setMemberLoading] = useState(false);
    const [Address, setAddress] = useState({
        data: "",
        error: ""
    });
    const [AreaName, setAreaName] = useState({
        data: "",
        error: ""
    });
    const [City, setCity] = useState({
        data: "",
        error: ""
    });
    const [State, setState] = useState({
        data: "",
        error: ""
    });
    const [Country, setCountry] = useState({
        data: "",
        error: ""
    });
    const [NameOnAccount, setNameOnAccount] = useState({
        data: "",
        error: ""
    });
    const [AccountNumber, setAccountNumber] = useState({
        data: "",
        error: ""
    });
    const [IFSCCode, setIFSCCode] = useState({
        data: "",
        error: ""
    });
    const [TypeOfAccount, setTypeOfAccount] = useState({
        data: "",
        error: ""
    });
    const [BankName, setBankName] = useState({
        data: "",
        error: ""
    });
    const [Branch, setBranch] = useState({
        data: "",
        error: ""
    });
    const [UPI, setUPI] = useState({
        data: "",
        error: ""
    });
    const [Education, setEducation] = useState({
        data: "",
        error: ""
    });
    const [MaritalStatus, setMaritalStatus] = useState({
        data: "",
        error: ""
    });
    const [SpouseEducation, setSpouseEducation] = useState({
        data: "",
        error: ""
    });
    const [ProofImage, setProofImage] = useState({
        data: "",
        error: ""
    });
    const [CurrentOccupation, setCurrentOccupation] = useState({
        data: "",
        error: ""
    });
    const [CurrentEmployer, setCurrentEmployer] = useState({
        data: "",
        error: ""
    });
    const [YearsAtCurrentEmployer, setYearsAtCurrentEmployer] = useState({
        data: "",
        error: ""
    });
    const [MonthlyIncome, setMonthlyIncome] = useState({
        data: "",
        error: ""
    });
    const [LivingIn, setLivingIn] = useState({
        data: "",
        error: ""
    });
    const [YearsAtCurrentResidence, setYearsAtCurrentResidence] = useState({
        data: "",
        error: ""
    });

    const Prefix = [{ value: "MR", data: "Mr" }, { value: "MRS", data: "Mrs" }, { value: "MS", data: "Ms" }, { value: "M/s", data: "M/s" }, { value: "Master", data: "Master" }];
    const GenderArray = ["Male", "Female", "Other"];
    const TypeOfAccountArray = ["Savings account", "Current account"];
    const CurrentOccupationArray = ["Public Sector", "Private Sector", "Business"];
    const ProofArray = ["ID PROOF", "SIGNATURE PROOF", "KYC", "OTHERS"];
    const KYCArray = ["Pancard", "Aadhar Card Front", "Aadhar Card Back"];
    const OtherArray = ["Bank Statement", "Salary Slip", "Other Income Proof", "ITR Form"];

    const [Alert, setAlert] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');
    const [TabIndex, setTabIndex] = useState('1');
    const [AddressDetailEmpty, setAddressDetailEmpty] = useState('');
    const [BankDetailEmpty, setBankDetailEmpty] = useState('');
    const [EducationDetailEmpty, setEducationDetailEmpty] = useState('');
    const [OccupationDetailEmpty, setOccupationDetailEmpty] = useState('');
    const [AddressId, setAddressId] = useState('');
    const [BankId, setBankId] = useState('');
    const [EducationId, setEducationId] = useState('');
    const [OccupationId, setOccupationId] = useState('');
    const [MediaList1, setMediaList] = useState([]);
    const [ProofAlert, setProofAlert] = useState(false);
    const [ProofType, setProofType] = useState({
        data: ProofArray[0],
        error: ""
    });
    const [KYCOtherType, setKYCOtherType] = useState({
        data: "",
        error: ""
    });
    const [MediaListLoading, setMediaListLoading] = useState(false);

    useEffect(() => {
        if (screen === "view" || screen === "edit"){
            GetMemberView();
        }
    }, [screen]);

    const GetMemberView = () => {
        setMemberLoading(true);
        const url = REACT_APP_HOST_URL + MEMBER_VIEW + data.id;
        console.log(url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setMemberLoading(false);
                if (json.success) {
                    setProfileImage({
                        data: json.list.mapped_photo != null ? json.list.mapped_photo : "",
                        error: ""
                    });
                    setNamePrefix({
                        data: json.list.nameprefix != null ? json.list.nameprefix : "",
                        error: ""
                    });
                    setMemberName({
                        data: json.list.name != null ? json.list.name : "",
                        error: ""
                    });
                    setRelationPrefix({
                        data: json.list.relation_prefix != null ? json.list.relation_prefix : "",
                        error: ""
                    });
                    setRelationship({
                        data: json.list.relationship != null ? json.list.relationship : "",
                        error: ""
                    });
                    setGender({
                        data: json.list.gender != null ? json.list.gender : "",
                        error: ""
                    });
                    setMobileNumber({
                        data: json.list.mapped_phone != null ? json.list.mapped_phone : "",
                        error: ""
                    });
                    setDob({
                        data: json.list.dob != null ? dayjs(json.list.dob) : null,
                        datesave: json.list.dob != null ? dayjs(json.list.dob).format('YYYY-MM-DD') : "",
                        error: ""
                    });
                    setEmail({
                        data: json.list.email != null ? json.list.email : "",
                        error: ""
                    });
                    setPancardNo({
                        data: json.list.pancardno != null ? json.list.pancardno : "",
                        error: ""
                    });
                    setAadharNo({
                        data: json.list.aadhar_no != null ? json.list.aadhar_no : "",
                        error: ""
                    });
                    setGuardName({
                        data: json.list.guard_name != null ? json.list.guard_name : "",
                        error: ""
                    });
                    setGuardRelationship({
                        data: json.list.guard_relationship != null ? json.list.guard_relationship : "",
                        error: ""
                    });
                    setWhatsappNo({
                        data: json.list.whatsapp_no != null ? json.list.whatsapp_no : "",
                        error: ""
                    });

                    if (json.list && json.list.address){
                        setAddressId(json.list.address.id != null ? json.list.address.id : "");
                        setAddress({
                            data: json.list.address.addressline1 != null ? json.list.address.addressline1 : "",
                            error: ""
                        });
                        setAreaName({
                            data: json.list.address.areaname != null ? json.list.address.areaname : "",
                            error: ""
                        });
                        setCity({
                            data: json.list.address.city != null ? json.list.address.city : "",
                            error: ""
                        });
                        setState({
                            data: json.list.address.state != null ? json.list.address.state : "",
                            error: ""
                        });
                        setCountry({
                            data: json.list.address.country != null ? json.list.address.country : "",
                            error: ""
                        });
                    }else{
                        setAddressDetailEmpty("no_data");
                    }

                    if (json.list && json.list.bankDetails) {
                        setBankId(json.list.bankDetails.id != null ? json.list.bankDetails.id : "");
                        setNameOnAccount({
                            data: json.list.bankDetails.name_on_account != null ? json.list.bankDetails.name_on_account : "",
                            error: ""
                        });
                        setAccountNumber({
                            data: json.list.bankDetails.accno != null ? json.list.bankDetails.accno : "",
                            error: ""
                        });
                        setIFSCCode({
                            data: json.list.bankDetails.ifsccode != null ? json.list.bankDetails.ifsccode : "",
                            error: ""
                        });
                        setTypeOfAccount({
                            data: json.list.bankDetails.type_of_account != null ? json.list.bankDetails.type_of_account : "",
                            error: ""
                        });
                        setBankName({
                            data: json.list.bankDetails.bankname != null ? json.list.bankDetails.bankname : "",
                            error: ""
                        });
                        setBranch({
                            data: json.list.bankDetails.bank_branch != null ? json.list.bankDetails.bank_branch : "",
                            error: ""
                        });
                        setUPI({
                            data: json.list.bankDetails.upi_id != null ? json.list.bankDetails.upi_id : "",
                            error: ""
                        });
                    } else {
                        setBankDetailEmpty("no_data");
                    }

                    if (json.list && json.list.education) {
                        setEducationId(json.list.education.id != null ? json.list.education.id : "");
                        setEducation({
                            data: json.list.education.education != null ? json.list.education.education : "",
                            error: ""
                        });
                        setMaritalStatus({
                            data: json.list.education.marital_status != null ? json.list.education.marital_status : "",
                            error: ""
                        });
                        setSpouseEducation({
                            data: json.list.education.spouse_education != null ? json.list.education.spouse_education : "",
                            error: ""
                        });
                    } else {
                        setEducationDetailEmpty("no_data");
                    }

                    if (json.list && json.list.occupation) {
                        setOccupationId(json.list.occupation.id != null ? json.list.occupation.id : "");
                        setCurrentOccupation({
                            data: json.list.occupation.occupation_name != null ? json.list.occupation.occupation_name : "",
                            error: ""
                        });
                        setCurrentEmployer({
                            data: json.list.occupation.current_employer_name != null ? json.list.occupation.current_employer_name : "",
                            error: ""
                        });
                        setYearsAtCurrentEmployer({
                            data: json.list.occupation.no_of_years != null ? json.list.occupation.no_of_years : "",
                            error: ""
                        });
                        setMonthlyIncome({
                            data: json.list.occupation.monthly_income != null ? json.list.occupation.monthly_income : "",
                            error: ""
                        });
                        setLivingIn({
                            data: json.list.occupation.rented_own_house != null ? json.list.occupation.rented_own_house : "",
                            error: ""
                        });
                        setYearsAtCurrentResidence({
                            data: json.list.occupation.years_current_residence != null ? json.list.occupation.years_current_residence : "",
                            error: ""
                        });
                    } else {
                        setOccupationDetailEmpty("no_data");
                    }

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
                setMemberLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                console.log(error);
            })
    }
    
    const MemberInfoParams = {
        "nameprefix": NamePrefix.data,
        "name": MemberName.data,
        "accno": "",
        "gender": Gender.data,
        "status": screen === "add" ? "approved" : data.status,
        "branchid": 0,
        "dob": Dob.datesave != null ? Dob.datesave : "",
        "email": Email.data,
        "pancardno": PancardNo.data,
        "weddingdate": "",
        "mapped_phone": MobileNumber.data,
        "mapped_photo": screen === "add" ? "" : ProfileImage.data,
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
        "canvas_agent_id": 0
    }

    const AddressDetailParams = {
        "mappedid": data.id,
        "addressline1": Address.data,
        "addressline2": "",
        "city": City.data,
        "areaid": "",
        "areaname": AreaName.data,
        "landmark": "",
        "state": State.data,
        "country": Country.data,
        "post_code": "",
    }

    const BankDetailParams = {
        "mappedid": data.id,
        "bankname": BankName.data,
        "ifsccode": IFSCCode.data,
        "accno": AccountNumber.data,
        "name_on_account": NameOnAccount.data,
        "type_of_account": TypeOfAccount.data,
        "bank_branch": Branch.data,
        "upi_id": UPI.data,
    }

    const EducationDetailParams = {
        "member_id": data.id,
        "education": Education.data,
        "marital_status": MaritalStatus.data,
        "spouse_education": SpouseEducation.data ? SpouseEducation.data : "",
    }

    const OccupationDetailParams = {
        "member_id": data.id,
        "occupation_name": CurrentOccupation.data,
        "current_employer_name": CurrentEmployer.data,
        "no_of_years": YearsAtCurrentEmployer.data,
        "monthly_income": MonthlyIncome.data,
        "rented_own_house": LivingIn.data,
        "years_current_residence": YearsAtCurrentResidence.data,
    }

    const MemberAddMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            let url = '';
            let Params = '';
            if(screen === "add" || TabIndex === '1'){
                url = REACT_APP_HOST_URL + MEMBER_ADD;
                Params = MemberInfoParams;
            }
            if (TabIndex === '2') {
                url = REACT_APP_HOST_URL + MEMBER_ADDRESS_SAVE;
                Params = AddressDetailParams;
            } else if (TabIndex === '3') {
                url = REACT_APP_HOST_URL + MEMBER_BANK_DETAIL_SAVE;
                Params = BankDetailParams;
            } else if (TabIndex === '4') {
                url = REACT_APP_HOST_URL + MEMBER_EDUCATION_DETAIL_SAVE;
                Params = EducationDetailParams;
            } else if (TabIndex === '6') {
                url = REACT_APP_HOST_URL + MEMBER_OCCUPATION_DETAIL_SAVE;
                Params = OccupationDetailParams;
            }
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

    const MemberUpdateMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            let url = '';
            let Params = '';
            if (TabIndex === '1') {
                url = REACT_APP_HOST_URL + MEMBER_UPDATE + data.id;
                Params = MemberInfoParams;
            } else if (TabIndex === '2') {
                url = REACT_APP_HOST_URL + MEMBER_ADDRESS_UPDATE + AddressId;
                Params = AddressDetailParams;
            } else if (TabIndex === '3') {
                url = REACT_APP_HOST_URL + MEMBER_BANK_DETAIL_UPDATE + BankId;
                Params = BankDetailParams;
            } else if (TabIndex === '4') {
                url = REACT_APP_HOST_URL + MEMBER_EDUCATION_DETAIL_UPDATE + EducationId;
                Params = EducationDetailParams;
            } else if (TabIndex === '6') {
                url = REACT_APP_HOST_URL + MEMBER_OCCUPATION_DETAIL_UPDATE + OccupationId;
                Params = OccupationDetailParams;
            }
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

    const GetMediaList = () => {
        setMediaListLoading(true);
        const url = REACT_APP_HOST_URL + MEMBER_MEDIA_LIST;
        console.log(url);;
        console.log(GetHeader(Session))
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setMediaListLoading(false);
                if (json.success) {
                    setMediaList(json.list);
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
                setMediaListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                console.log(error);
            })
    }

    const MemberImageUpload = (fileToUpload, imagetype) => {
        console.log(fileToUpload);
        if (fileToUpload != null && fileToUpload !== "") {
            setLoading(true);
            const form = new FormData();
            form.append("uploaded_file", fileToUpload);
            const url = `${REACT_APP_HOST_URL}${MEMBER_IMAGE_UPLOAD}&type=${imagetype}&ref_id=${data.id}`;
            const formDataObject = {};
            form.forEach((value, key) => {
                formDataObject[key] = value;
            });
            console.log(formDataObject);
            console.log(form);
            console.log(url);
            console.log(JSON.parse(Session));
            fetch(url, PostImageHeader(JSON.parse(Session), formDataObject))
                .then((response) => response.json())
                .then((json) => {
                    console.log(JSON.stringify(json));
                    setLoading(false);
                    if (json.success) {
                        if (imagetype === "MEMBER_PROFILE"){
                            setProfileImage({
                                data: json.uploaded_path,
                                error: ""
                            });
                        }else{
                            setProofImage({
                                data: json.uploaded_path,
                                error: ""
                            });
                        }
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

    const MediaSaveParams = {
        id: 0,
        master_mappedid: data.id,
        master_mappedtype: "MEMBER",
        master_mappedtypeno: 1,
        entry_mappedtype: "",
        entry_mappedtypeno: "",
        path: "",
        name: "",
        comments: "Member"
    };

    const MemberMediaSave = (imagepath) => {
        if (imagepath != null && imagepath !== "") {
            setLoading(true);
            MediaSaveParams.path = imagepath;
            if (ProofType.data === "ID PROOF"){
                MediaSaveParams.entry_mappedtype = "ID_PROOF";
                MediaSaveParams.entry_mappedtypeno = 101;
            } else if (ProofType.data === "SIGNATURE PROOF") {
                MediaSaveParams.entry_mappedtype = "SIGNATURE";
                MediaSaveParams.entry_mappedtypeno = 103;
            } else if (ProofType.data === "KYC") {
                if (KYCOtherType.data === "Pancard") {
                    MediaSaveParams.entry_mappedtype = "PANCARD";
                    MediaSaveParams.entry_mappedtypeno = 103;
                } else if (KYCOtherType.data === "Aadhar Card Front") {
                    MediaSaveParams.entry_mappedtype = "AADHAR_CARD_PROOF";
                    MediaSaveParams.entry_mappedtypeno = 109;
                } else if (KYCOtherType.data === "Aadhar Card Back") {
                    MediaSaveParams.entry_mappedtype = "AADHAARCARD_BACK";
                    MediaSaveParams.entry_mappedtypeno = 127;
                }
            } else if (ProofType.data === "OTHERS") {
                if (KYCOtherType.data === "Bank Statement") {
                    MediaSaveParams.entry_mappedtype = "BANK_STATEMENT";
                    MediaSaveParams.entry_mappedtypeno = 131;
                } else if (KYCOtherType.data === "Salary Slip") {
                    MediaSaveParams.entry_mappedtype = "SALARY_SLIP";
                    MediaSaveParams.entry_mappedtypeno = 128;
                } else if (KYCOtherType.data === "Other Income Proof") {
                    MediaSaveParams.entry_mappedtype = "OTHER_INCOME_PROOF";
                    MediaSaveParams.entry_mappedtypeno = 129;
                } else if (KYCOtherType.data === "ITR Form") {
                    MediaSaveParams.entry_mappedtype = "ITR_FORM";
                    MediaSaveParams.entry_mappedtypeno = 130;
                }
            } 
            const url = REACT_APP_HOST_URL + MEMBER_IMAGE_UPLOAD
            console.log(JSON.stringify(MediaSaveParams));
            console.log(url);
            fetch(url, PostHeader(JSON.parse(Session), MediaSaveParams))
                .then((response) => response.json())
                .then((json) => {
                    console.log(JSON.stringify(json));
                    setLoading(false);
                    if (json.success) {
                        GetMediaList();
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

    const MemberDeleteMedia = (file, id) => {
        setLoading(true);
        const url = REACT_APP_HOST_URL + MEMBER_MEDIA_DELETE + id;
        console.log(url);
        console.log(Session);
        fetch(url, DeleteHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setLoading(false);
                if (json.success) {
                    if(file !== ""){
                        MemberImageUpload(file, "MEMBER_PROFILE");
                    }else{
                        GetMediaList();
                    }
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

    const MediaList = [
        { id: 1, image: "https://cdn.dummyjson.com/product-images/1/1.jpg", },
        { id: 2, image: "https://cdn.dummyjson.com/product-images/2/1.jpg", },
        { id: 3, image: "https://cdn.dummyjson.com/product-images/3/1.jpg", },
        { id: 4, image: "https://cdn.dummyjson.com/product-images/4/1.jpg", },
        { id: 5, image: "https://cdn.dummyjson.com/product-images/5/1.jpg", }
    ]

    const MemberInfoTextValidate = (e, from) => {
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
                datesave: text.trim() !== "" ? text : "",
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

    const validateMemberInfo = () => {
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
        if (!Gender.data || Gender.data === "Select") {
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
        if(screen === "edit"){
            if (!ProfileImage.data) {
                IsValidate = false;
                setProfileImage(prevState => ({
                    ...prevState,
                    error: "* Required"
                }));
            } else {
                setProfileImage(prevState => ({
                    ...prevState,
                    error: ""
                }));
            }
        }
        if(screen === "add"){
            MemberAddMethod(IsValidate);
        }else{
            MemberUpdateMethod(IsValidate);
        }
    
    }

    const AddressDetailsTextValidate = (e, from) => {
        const text = e.target.value;
        console.log(from);
        if (from === "Address") {
            setAddress(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "AreaName") {
            setAreaName(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "City") {
            setCity(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "State") {
            setState(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Country") {
            setCountry(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        }
    };

    const validateAddressDetails = () => {
        let IsValidate = true;
        if (!Address.data) {
            IsValidate = false;
            setAddress(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAddress(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!AreaName.data) {
            IsValidate = false;
            setAreaName(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAreaName(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!City.data) {
            IsValidate = false;
            setCity(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setCity(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!State.data) {
            IsValidate = false;
            setState(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Country.data) {
            IsValidate = false;
            setCountry(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setCountry(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        console.log("AddressDetailEmpty");
        console.log(AddressDetailEmpty);
        console.log(IsValidate);
        if (AddressDetailEmpty === "no_data"){
            MemberAddMethod(IsValidate);
        } else{
            MemberUpdateMethod(IsValidate);
        }
    }

    const BankDetailsTextValidate = (e, from) => {
        const text = e.target.value;
        console.log(from);
        if (from === "NameOnAccount") {
            setNameOnAccount(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "AccountNumber") {
            setAccountNumber(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "IFSCCode") {
            setIFSCCode(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "TypeOfAccount") {
            setTypeOfAccount(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" || text.trim() === "Select" ? "* Required" : ""
            }));
        } else if (from === "BankName") {
            setBankName(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Branch") {
            setBranch(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "UPI") {
            setUPI(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        }
    };

    const validateBankDetails = () => {
        let IsValidate = true;
        if (!NameOnAccount.data) {
            IsValidate = false;
            setNameOnAccount(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setNameOnAccount(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!AccountNumber.data) {
            IsValidate = false;
            setAccountNumber(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAccountNumber(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!IFSCCode.data) {
            IsValidate = false;
            setIFSCCode(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setIFSCCode(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!TypeOfAccount.data || TypeOfAccount.data === "Select") {
            IsValidate = false;
            setTypeOfAccount(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setTypeOfAccount(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!BankName.data) {
            IsValidate = false;
            setBankName(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setBankName(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Branch.data) {
            IsValidate = false;
            setBranch(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setBranch(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!UPI.data) {
            IsValidate = false;
            setUPI(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setUPI(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (BankDetailEmpty === "no_data") {
            MemberAddMethod(IsValidate);
        } else {
            MemberUpdateMethod(IsValidate);
        }
    }

    const validateEducationDetails = () => {
        let IsValidate = true;
        if (!Education.data) {
            IsValidate = false;
            setEducation(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setEducation(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!MaritalStatus.data) {
            IsValidate = false;
            setMaritalStatus(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setMaritalStatus(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (MaritalStatus === "Married" || MaritalStatus === "Married With Kids"){
            if (!SpouseEducation.data) {
                IsValidate = false;
                setSpouseEducation(prevState => ({
                    ...prevState,
                    error: "* Required"
                }));
            } else {
                setSpouseEducation(prevState => ({
                    ...prevState,
                    error: ""
                }));
            }
        }
        if (EducationDetailEmpty === "no_data") {
            MemberAddMethod(IsValidate);
        } else {
            MemberUpdateMethod(IsValidate);
        }
    }

    const validateProofDetails = () => {
        let IsValidate = true;
        if (!ProofImage.data) {
            IsValidate = false;
            setProofImage(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setProofImage(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!ProofType.data) {
            IsValidate = false;
            setProofType(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setProofType(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (ProofType.data === "KYC" || ProofType.data === "OTHERS"){
            if (!KYCOtherType.data) {
                IsValidate = false;
                setKYCOtherType(prevState => ({
                    ...prevState,
                    error: "* Required"
                }));
            } else {
                setKYCOtherType(prevState => ({
                    ...prevState,
                    error: ""
                }));
            }
        }
        MemberMediaSave(ProofImage)
    }

    const OccupationDetailsTextValidate = (e, from) => {
        const text = e.target.value;
        console.log(from);
        if (from === "CurrentOccupation") {
            setCurrentOccupation(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" || text.trim() === "Select" ? "* Required" : ""
            }));
        } else if (from === "CurrentEmployer") {
            setCurrentEmployer(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "YearsAtCurrentEmployer") {
            setYearsAtCurrentEmployer(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "MonthlyIncome") {
            setMonthlyIncome(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "YearsAtCurrentResidence") {
            setYearsAtCurrentResidence(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        }
    };

    const validateOccupationDetails = () => {
        let IsValidate = true;
        if (!CurrentOccupation.data || CurrentOccupation.data === "Select") {
            IsValidate = false;
            setCurrentOccupation(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setCurrentOccupation(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!CurrentEmployer.data) {
            IsValidate = false;
            setCurrentEmployer(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setCurrentEmployer(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!YearsAtCurrentEmployer.data) {
            IsValidate = false;
            setYearsAtCurrentEmployer(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setYearsAtCurrentEmployer(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!MonthlyIncome.data) {
            IsValidate = false;
            setMonthlyIncome(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setMonthlyIncome(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!YearsAtCurrentResidence.data) {
            IsValidate = false;
            setYearsAtCurrentResidence(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setYearsAtCurrentResidence(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        console.log(LivingIn)
        if (LivingIn.data === "") {
            IsValidate = false;
            setLivingIn(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setLivingIn(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (OccupationDetailEmpty === "no_data") {
            MemberAddMethod(IsValidate);
        } else {
            MemberUpdateMethod(IsValidate);
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
    
    const handleChange = (event, newValue) => {
        console.log(newValue);
        setTabIndex(newValue);
    };

    const HandleChoosePhoto = (event) => {
        console.log("dsadas")
    };

    const HandleSubmitClick = () => {
        console.log("submitclick11");
        if (screen === "add" || TabIndex === '1'){
            validateMemberInfo();
        }
        if (TabIndex === '2') {
            console.log("submitclick")
            validateAddressDetails();
        } else if (TabIndex === '3') {
            validateBankDetails();
        } else if (TabIndex === '4') {
            validateEducationDetails();
        } else if (TabIndex === '6') {
            validateOccupationDetails();
        }
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const HandleProfileImage = (event) => {
        console.log(event);
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            const filePath = URL.createObjectURL(file);
            console.log(filePath);
            setProfileImage({
                data: filePath,
                error: ""
            });
            MemberImageUpload(file, 'MEMBER_PROFILE');
            /*if(ProfileImage.data !== ""){
                MemberDeleteMedia(file, data.id);
            }else{
                setProfileImage({
                    data: filePath,
                    error: ""
                });
                MemberImageUpload(filePath, 'MEMBER_PROFILE');
            }*/
        }
    };

    const HandleProofImage = (event) => {
        console.log(event);
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            const filePath = URL.createObjectURL(file);
            console.log(filePath);
            setProofImage({
                data: filePath,
                error: ""
            });
        }
    };

    const HandleProofAlertClose = () => {
        setProofAlert(false);
    };

    const HandleDateChange = (date) => {
        const DateForSave = dayjs(date).format('YYYY-MM-DD');
        console.log('Date to save:', DateForSave);
        setDob({
            data: date,
            datesave: DateForSave,
            error: ""
        });
    };
    
   
   
    const currentDate = dayjs();
    const maxDate = currentDate.subtract(18, 'year');

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    return (
        <Container>
        <Stack direction='row' spacing={2} alignItems='center' justifyContent={'space-between'} sx={{mt:2, mb:2}}>
        <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 2, mb: 2 }}>
        {screen === "add" ? "Add Member" : (screen === "view" ? "View Member" : "Edit Member")}
    </Typography>
    <Button variant="contained" className='custom-button'  onClick={() => navigate('/member')}>
          Back
    </Button>
  
    </Stack>
            <Card>
              
                <Box component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 2, width: '20ch', },
                    }}
                    noValidate
                    autoComplete="off">
                    {MemberLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="../../../public/assets/icons/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                            <TabContext value={TabIndex}>
                                {screen === "add" 
                                    ? <Typography variant="subtitle1" sx={{ ml: 4, mr: 5 , mt:3}}>
                                        Member Information
                                     </Typography>
                                    : <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleChange} aria-label="lab API tabs example"
                                            variant="scrollable" scrollButtons="auto">
                                            <Tab label="Member Information" value="1" />
                                            <Tab label="Address Details" value="2" />
                                            <Tab label="Bank Details" value="3" />
                                            <Tab label="Education Details" value="4" />
                                            <Tab label="Proof Details" value="5" />
                                            <Tab label="Occupation Details" value="6" />
                                        </TabList>
                                    </Box>}
                                <TabPanel value="1">
                                    {screen === "add"
                                        ? null
                                        : <Stack spacing={2} sx={{ mb: 3, alignItems: 'flex-end', mr: 3 }}>
                                            <Stack direction='column' sx={{ ml: 2, }}>
                                                {ProfileImage.data !== ""
                                                    ? <div>
                                                        <img src={"https://storage.googleapis.com/stgasset.iar.net.in/" + ProfileImage.data} alt="Selected" style={{ width: 100, height: 100, }} />
                                                    </div>
                                                    : <div>
                                                        <img src="../../../public/assets/icons/placeholder.png" alt="Selected" style={{ width: 100, height: 100, }} />
                                                    </div>
                                                }
                                                <Button component="label" variant="contained" tabIndex={-1} sx={{ width: 130, height: 40, mt: 2 }}>
                                                    Upload Photo
                                                    <VisuallyHiddenInput type="file" onChange={HandleProfileImage} />
                                                </Button>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{ProfileImage.error}</div>
                                            </Stack>
                                        </Stack>}
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Member Name
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box'
                                                    id="outlined-select-currency"
                                                    select
                                                    disabled={screen === "view" ? true : false}
                                                    
                                                    variant="outlined"
                                                    value={NamePrefix.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "NamePrefix")}
                                                    style={{ width: 90, marginRight: -10, color: 'black' }} >
                                                    {Prefix.map((option) => (
                                                        <MenuItem key={option} value={option.value}>
                                                            {option.data}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Member Name"
                                                    variant="outlined"
                                                    value={MemberName.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "MemberName")} />
                                               
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{MemberName.error || NamePrefix.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                RelationShip
                                            </Typography>
                                            <Stack direction='row'  sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box'
                                                    id="outlined-select-currency"
                                                    select
                                                    disabled={screen === "view" ? true : false}
                                                    label=""
                                                    variant="outlined"
                                                    value={RelationPrefix.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "RelationPrefix")}
                                                    style={{ width: 90, marginRight: -10 }} >
                                                    {Prefix.map((option) => (
                                                        <MenuItem key={option} value={option.value}>
                                                            {option.data}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Relationhsip"
                                                    value={Relationship.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "Relationship")} />
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "15px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500",  }} className='req'>{Relationship.error || RelationPrefix.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                  
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Gender
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-select-currency"
                                                    select
                                                    disabled={screen === "view" ? true : false}
                                                    label="Select"
                                                    variant="outlined"
                                                    value={Gender.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "Gender")}
                                                    style={{  }}>
                                                    {GenderArray.map((option) => (
                                                        <MenuItem key={option} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                             
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Gender.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                Mobile Number
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Mobile Number"
                                                    value={MobileNumber.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "MobileNumber")}
                                                    style={{  }} />
                                               
                                            </Stack>
                                            <div style={{ marginLeft: "15px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{MobileNumber.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                    
                                   
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Date of Birth
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer components={['DatePicker']} sx={{ width: 525 }} className="date-pick">
                                                        <DatePicker 
                                                        className='input-box1'
                                                            value={Dob.data}
                                                            onChange={HandleDateChange}
                                                            format="DD-MM-YYYY"
                                                            maxDate={maxDate}
                                                            renderInput={(params) => <TextField {...params} />}
                                                          
                                                            sx={{  }} />
                                                    </DemoContainer>
                                                </LocalizationProvider>
                                               
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Dob.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                Email
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Email"
                                                    value={Email.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "Email")}
                                                    style={{  }} />
                                            </Stack>
                                            <div style={{ marginLeft: "15px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{Email.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                    
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Whatsapp Number
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                    required
                                                    className='input-box1'
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Whatsapp Number"
                                                    value={WhatsappNo.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "WhatsappNo")}
                                                    style={{  }} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{WhatsappNo.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                Guardian Name
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                    required
                                                    className='input-box1'
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Guardian Name"
                                                    value={GuardName.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "GuardName")}
                                                    style={{ }} />
                                            </Stack>
                                            <div style={{ marginLeft: "15px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{GuardName.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box' >
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Guardian Relation
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Guardian Relation"
                                                    value={GuardRelationship.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "GuardRelationship")}
                                                    style={{  }} />
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GuardRelationship.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box' >
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                Aadhar Number
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Aadhar Number"
                                                    value={AadharNo.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "AadharNo")}
                                                    style={{  }} />
                                            </Stack>
                                            <div style={{ marginTop: "-10px", marginLeft: "15px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{AadharNo.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                PanCard Number
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Pancard Number"
                                                    value={PancardNo.data}
                                                    onChange={(e) => MemberInfoTextValidate(e, "PancardNo")}
                                                    style={{ }} />
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{PancardNo.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                </TabPanel>
                                <TabPanel value="2">
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Address
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Address"
                                                    value={Address.data}
                                                    onChange={(e) => AddressDetailsTextValidate(e, "Address")}
                                                    style={{  }} />
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Address.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                Area Name
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Area Name"
                                                    value={AreaName.data}
                                                    onChange={(e) => AddressDetailsTextValidate(e, "AreaName")}
                                                    style={{  }} />
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "15px",  color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{AreaName.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack> 
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                City
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="City"
                                                    value={City.data}
                                                    onChange={(e) => AddressDetailsTextValidate(e, "City")}
                                                    style={{  }} />
                                               
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{City.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                State
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="State"
                                                    value={State.data}
                                                    onChange={(e) => AddressDetailsTextValidate(e, "State")}
                                                    style={{  }} />
                                            </Stack>
                                            <div style={{ marginTop: "-10px", marginLeft: "15px",color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{State.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Country
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Country"
                                                    value={Country.data}
                                                    onChange={(e) => AddressDetailsTextValidate(e, "Country")}
                                                    style={{  }} />
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Country.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                </TabPanel>
                                <TabPanel value="3">
                              
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Name on Account
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Name on Account"
                                                    value={NameOnAccount.data}
                                                    onChange={(e) => BankDetailsTextValidate(e, "NameOnAccount")}
                                                    style={{  }} />
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{NameOnAccount.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                Account Number
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Account Number"
                                                    value={AccountNumber.data}
                                                    onChange={(e) => BankDetailsTextValidate(e, "AccountNumber")}
                                                    style={{  }} />
                                            
                                            </Stack>
                                            <div style={{  marginTop: "-10px", marginLeft: "15px",color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{AccountNumber.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                    
                                    
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                IFSC Code
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="IFSC Code"
                                                    value={IFSCCode.data}
                                                    onChange={(e) => BankDetailsTextValidate(e, "IFSCCode")}
                                                    style={{  }} />
                                             
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{IFSCCode.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                Type of Account
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-select-currency"
                                                    select
                                                    disabled={screen === "view" ? true : false}
                                                    label="Select"
                                                    variant="outlined"
                                                    value={TypeOfAccount.data}
                                                    onChange={(e) => BankDetailsTextValidate(e, "TypeOfAccount")}
                                                    style={{  }}>
                                                    {TypeOfAccountArray.map((option) => (
                                                        <MenuItem key={option} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "15px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{TypeOfAccount.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                            
                                  
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Bank Name
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Bank Name"
                                                    value={BankName.data}
                                                    onChange={(e) => BankDetailsTextValidate(e, "BankName")}
                                                    style={{ }} />
                                            
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{BankName.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                Branch
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Branch"
                                                    value={Branch.data}
                                                    onChange={(e) => BankDetailsTextValidate(e, "Branch")}
                                                    style={{  }} />
                                            </Stack>
                                            <div style={{ marginTop: "-10px", marginLeft: "15px",color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Branch.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                    
                                   
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                UPI
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="UPI"
                                                    value={UPI.data}
                                                    onChange={(e) => BankDetailsTextValidate(e, "UPI")}
                                                    style={{  }} />
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{UPI.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                </TabPanel>
                                <TabPanel value="4">
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:3, mr: 2, mt: 2, mb: 1 }}>
                                                Education
                                            </Typography>
                                            <Stack direction='row' sx={{ ml:0, }} className='radio-box'>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultValue="female"
                                                    name="radio-buttons-group"
                                                    row 
                                                    value={Education.data}
                                                    onChange={(e) => setEducation({ data: e.target.value, error: "" })}>
                                                    <FormControlLabel value="Primary" control={<Radio />} label="Primary" disabled={screen === "view" ? true : false} />
                                                    <FormControlLabel value="Secondary" control={<Radio />} label="Secondary" disabled={screen === "view" ? true : false} />
                                                    <FormControlLabel className="radio-control2" value="Diploma" control={<Radio />} label="Diploma" disabled={screen === "view" ? true : false} />
                                                    <FormControlLabel value="Graduate" control={<Radio />} label="Graduate" disabled={screen === "view" ? true : false} />
                                                    <FormControlLabel className="radio-control" value="Post Graduate" control={<Radio />} label="Post Graduate" disabled={screen === "view" ? true : false} />
                                                    <FormControlLabel className="radio-control1" value="Doctrate" control={<Radio />} label="Doctorate" onChange={() => setEducation('Doctrate')} disabled={screen === "view" ? true : false} />
                                                </RadioGroup>
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Education.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:3, mr: 2, mt: 2, mb: 1 }}>
                                                Marital Status
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }} className='radio-box'>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultValue="female"
                                                    name="radio-buttons-group"
                                                    row 
                                                    value={MaritalStatus.data}
                                                    onChange={(e) => setMaritalStatus({ data: e.target.value, error: "" })}>
                                                    <FormControlLabel value="Single" control={<Radio />} label="Single" disabled={screen === "view" ? true : false} />
                                                    <FormControlLabel value="Married" control={<Radio />} label="Married" disabled={screen === "view" ? true : false} />
                                                    <FormControlLabel value="Married With Kids" control={<Radio />} label="Married with Kids" disabled={screen === "view" ? true : false} />
                                                    <FormControlLabel value="Divorced" control={<Radio />} label="Divorced" disabled={screen === "view" ? true : false} />
                                                    <FormControlLabel className="radio-control3" value="Separated" control={<Radio />} label="Separated" disabled={screen === "view" ? true : false} />
                                                </RadioGroup>
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{MaritalStatus.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                    {MaritalStatus === "Married" || MaritalStatus === "Married With Kids"
                                        ? <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Spouse Education
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        name="radio-buttons-group"
                                                        row
                                                        value={SpouseEducation.data}
                                                        onChange={(e) => setSpouseEducation({ data: e.target.value, error: "" })}>
                                                        <FormControlLabel value="Primary" control={<Radio />} label="Primary" disabled={screen === "view" ? true : false} />
                                                        <FormControlLabel value="Secondary" control={<Radio />} label="Secondary" disabled={screen === "view" ? true : false} />
                                                        <FormControlLabel value="Diploma" control={<Radio />} label="Diploma" disabled={screen === "view" ? true : false} />
                                                        <FormControlLabel value="Graduate" control={<Radio />} label="Graduate" disabled={screen === "view" ? true : false} />
                                                        <FormControlLabel value="Post Graduate" control={<Radio />} label="Post Graduate" disabled={screen === "view" ? true : false} />
                                                        <FormControlLabel value="Doctrate" control={<Radio />} label="Doctorate" disabled={screen === "view" ? true : false} />
                                                    </RadioGroup>
                                                  
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{SpouseEducation.error}</div>
                                            </Stack>
                                            </div>
                                         </Stack>
                                        : null }
                                    
                                </TabPanel>
                                <TabPanel value="5">
    <Stack direction='column' spacing={2}>
        {screen === "view"
            ? null
            : <Stack spacing={2}  style={{ justifyContent: 'flex-end' }}>
                <Button component="label" variant="contained" tabIndex={-1} sx={{ width: 130, height: 30 }} onClick={() => setProofAlert(true)}>
                    Choose Photo
                </Button>
              </Stack>
        }
        <Stack direction='row' spacing={2} sx={{ mb: 3, mt:2, alignItems: 'flex-end', mr: 3 }} className='row-box'>
            {MediaList.map((row) => (
                <Stack direction='column' sx={{ ml: 2 }} key={row.id} className='boxing'>
                   
                    {row.image
                        ? <Stack direction='row' sx={{ ml: 0 }} className='image-top'>
                        <div className='img-box' style={{ width: 120, height: 120 }}>
                            <img src={row.image} alt="Selected"  style={{ width: '100% ', height: '100% '}} />
                            </div>
                            <Button onClick={() => MemberDeleteMedia("", row.id)} className='btn-click'>
                                <img src="../../../public/assets/icons/cancel.png" alt="Selected" style={{ width: 12, height: 12 }} />
                            </Button>
                          </Stack>
                        : <Stack>
                        <div className='img-box' style={{ width: 100, height: 100 }}>
                            <img src="../../../public/assets/icons/placeholder.png" alt="Selected" style={{ width: '100% '}} />
                            </div>
                          </Stack>
                    }
                    <Typography variant="subtitle1" sx={{ ml: 3, mr: 2, mt: 0, mb: '-5px' }}>
                    Pancard
                </Typography>
                </Stack>
            ))}
        </Stack>
    </Stack>
</TabPanel>

                                <TabPanel value="6">
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Current Occupation
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                required
                                                    id="outlined-select-currency"
                                                    select
                                                    disabled={screen === "view" ? true : false}
                                                    label="Select"
                                                    variant="outlined"
                                                    value={CurrentOccupation.data}
                                                    onChange={(e) => OccupationDetailsTextValidate(e, "CurrentOccupation")}
                                                    style={{ }}>
                                                    {CurrentOccupationArray.map((option) => (
                                                        <MenuItem key={option} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                               
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{CurrentOccupation.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                Current Employer
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Current Employer"
                                                    value={CurrentEmployer.data}
                                                    onChange={(e) => OccupationDetailsTextValidate(e, "CurrentEmployer")}
                                                    style={{ }} />
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "15px",  marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{CurrentEmployer.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box' >
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Years at Current Employer
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Years at Current Employer"
                                                    value={YearsAtCurrentEmployer.data}
                                                    onChange={(e) => OccupationDetailsTextValidate(e, "YearsAtCurrentEmployer")}
                                                    style={{ }} />
                                               
                                            </Stack>
                                            <div style={{ marginLeft: "15px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{YearsAtCurrentEmployer.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                Monthly Income
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Monthly Income"
                                                    value={MonthlyIncome.data}
                                                    onChange={(e) => OccupationDetailsTextValidate(e, "MonthlyIncome")}
                                                    style={{  }} />
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "15px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{MonthlyIncome.error}</div>
                                        </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                    <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                                Living in Rented House/Own House
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 2, mt: 2 }}>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultValue="female"
                                                    name="radio-buttons-group"
                                                    row 
                                                    value={LivingIn.data}
                                                    onChange={(e) => setLivingIn({ data: e.target.value, error: "" })}>
                                                    <FormControlLabel value="0" control={<Radio />} label="Rented House" disabled={screen === "view" ? true : false} />
                                                    <FormControlLabel value="1" control={<Radio />} label="Own House" disabled={screen === "view" ? true : false} />
                                                </RadioGroup>
                                              
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{LivingIn.error}</div>
                                        </Stack>
                                        </div>
                                        <div className='box'>
                                        <Stack direction='column'>
                                            <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                                Years at Current Residence
                                            </Typography>
                                            <Stack direction='row' sx={{ ml: 0, }}>
                                                <TextField
                                                className='input-box1'
                                                    required
                                                    id="outlined-required"
                                                    disabled={screen === "view" ? true : false}
                                                    label="Years at Current Residence"
                                                    value={YearsAtCurrentResidence.data}
                                                    onChange={(e) => OccupationDetailsTextValidate(e, "YearsAtCurrentResidence")}
                                                    style={{  }} />
                                            </Stack>
                                        
                                        </Stack>
                                        <div style={{ marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{YearsAtCurrentResidence.error}</div>
                                        </div>
                                    </Stack>
                                </TabPanel>
                            </TabContext>
                            {screen === "view" || TabIndex === "5"
                                ? null
                                :<Stack direction='column' alignItems='flex-end'>
                                        <Button sx={{ mr: 5, mb: 3, height: 50, width: 150 }} variant="contained"  className='custom-button' onClick={HandleSubmitClick}>
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
                    <Typography gutterBottom variant='h4' mt={2} mb={5} color={AlertFrom === "success" ? "#45da81" : "#ef4444"}>
                        {AlertMessage}
                    </Typography>
                </Stack>
            </Dialog>
            <Dialog
                open={ProofAlert}
                onClose={HandleProofAlertClose}
                fullWidth={500}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <IconButton
                    aria-label="close"
                    onClick={HandleProofAlertClose}
                    sx={{ position: 'absolute', right: 15, top: 20, color: (theme) => theme.palette.grey[500], }} >
                    <img src="../../../public/assets/icons/cancel.png" alt="Loading" style={{ width: 17, height: 17, }} />
                </IconButton>
                <Stack flexDirection='row' sx={{ mt: 3, ml: 3 }}>
                    <Button component="label" variant="contained" tabIndex={-1} sx={{ width: 130, height: 40 }}>
                        Upload Proof
                        <VisuallyHiddenInput type="file" onChange={HandleProofImage} />
                    </Button>
                    <div style={{ marginLeft: "25px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{ProofImage.error}</div>
                </Stack>
                <Stack sx={{ mt: 2, ml: 3 }}>
                    <Stack direction='row'>
                        <img src={MediaList[0].image} alt="Selected" style={{ width: 120, height: 120, }} />
                        <Stack flexDirection='column' sx={{ ml: 3, }}>
                            <Stack flexDirection='row'>
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    variant="outlined"
                                    value={ProofType.data}
                                    onChange={(e) => {setProofType({data: e.target.value , error: ""}); 
                                        setKYCOtherType({ data: e.target.value === "KYC" ? KYCArray[0] : e.target.value === "OTHERS" ? OtherArray[0] : "", error: ""})}}
                                    style={{ width: 150, color: 'black', }} >
                                    {ProofArray.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{ProofType.error}</div>
                            </Stack>
                            {ProofType.data === "KYC" || ProofType.data === "OTHERS"
                                ? <Stack flexDirection='row' sx={{  }}>
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        variant="outlined"
                                        value={KYCOtherType.data}
                                        onChange={(e) => setKYCOtherType({ data: e.target.value, error: "" })}
                                        style={{ width: 150, color: 'black' }} >
                                        {ProofType.data === "KYC"
                                            ? KYCArray.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))
                                            : OtherArray.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                    </TextField>
                                   
                                </Stack>
                               
                                : null}
                                <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{KYCOtherType.error}</div>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack sx={{ alignItems: 'center', mt: 1, mb: 3 }}>
                    <Button component="label" variant="contained" tabIndex={-1} sx={{ width: 100, height: 40 }} onClick={validateProofDetails}>
                       Save
                    </Button>
                </Stack>
            </Dialog>
        </Container>
    );
}
