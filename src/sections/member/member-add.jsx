import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { useState, useEffect, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Tab, Radio, Stack, Alert, Button, Dialog, MenuItem, Snackbar, RadioGroup, IconButton, Typography, DialogTitle, DialogActions, FormControlLabel } from '@mui/material';

import { GetHeader, PutHeader, PostHeader, DeleteHeader, PostImageHeader } from 'src/hooks/AxiosApiFetch';

import { isValidEmail } from 'src/utils/Validator';
import { MEMBER_ADD, STATE_LIST, MEMBER_VIEW, COUNTRY_LIST, MEMBER_UPDATE, MEMBER_MEDIA_LIST, MEMBER_MEDIA_SAVE, REACT_APP_HOST_URL, MEMBER_ADDRESS_SAVE, MEMBER_IMAGE_UPLOAD,
    MEMBER_MEDIA_DELETE, MEMBER_ADDRESS_UPDATE, MEMBER_BANK_DETAIL_SAVE, MEMBER_BANK_DETAIL_UPDATE, MEMBER_EDUCATION_DETAIL_SAVE,
    MEMBER_OCCUPATION_DETAIL_SAVE, MEMBER_EDUCATION_DETAIL_UPDATE, MEMBER_OCCUPATION_DETAIL_UPDATE,
} from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import './member-add.css';

export default function AddMemberPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state;
    const Session = localStorage.getItem('apiToken');

    const Prefix = [{ value: "MR", data: "Mr" }, { value: "MRS", data: "Mrs" }, { value: "MS", data: "Ms" }, { value: "M/s", data: "M/s" }, { value: "Master", data: "Master" }];
    const RelationShipPrefix = [{ value: "S/O", data: "S/o" }, { value: "D/O", data: "D/o" }, { value: "W/O", data: "W/o" }, { value: "C/O", data: "C/O" },];
    const GenderArray = ["Male", "Female"];
    const TypeOfAccountArray = ["Savings account", "Current account"];
    const CurrentOccupationArray = ["Public Sector", "Private Sector", "Business"];
    const ProofArray = ["ID PROOF", "SIGNATURE PROOF", "KYC", "OTHERS"];
    const KYCArray = ["Pancard", "Aadhar Card Front", "Aadhar Card Back"];
    const OtherArray = ["Bank Statement", "Salary Slip", "Other Income Proof", "ITR Form"];

    const [NamePrefix, setNamePrefix] = useState({
        data: Prefix[0].value,
        error: ""
    });
    const [MemberName, setMemberName] = useState({
        data: "",
        error: ""
    });
    const [RelationPrefix, setRelationPrefix] = useState({
        data: RelationShipPrefix[0].data,
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
        savedata: "",
        type: "",
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
        savedata: "",
        type: "",
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
    const [AlertOpen, setAlertOpen] = useState(false);
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
    const [MediaList, setMediaList] = useState([]);
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
    const ImageUrl = JSON.parse(localStorage.getItem('imageUrl'));
    const [StateList, setStateList] = useState([]);
    const [CountryList, setCountryList] = useState([]);
    const [ProfileUploadLoading, setProfileUploadLoading] = useState(false);
    const [ConfirmAlert, setConfirmAlert] = useState(false);
    const [MediaId, setMediaId] = useState('');
    const [ProofLoading, setProofLoading] = useState(false);
    const [ProfileMediaId, setProfileMediaId] = useState('');
    const [ScreenRefresh, setScreenRefresh] = useState(0);
    const [MemberSaveId, setMemberSaveId] = useState({
        id: ''
    });

    useEffect(() => {
        if (screen === "view" || screen === "edit") {
            GetMemberView();
            GetMediaList("", "");
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

    useEffect(() => {
        const handleBackButton = (event) => {
            console.log('Back button pressed!', event);
            navigate('/member/list');
        };
        window.addEventListener('popstate', handleBackButton);
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const GetMemberView = () => {
        setMemberLoading(true);
        const url = `${REACT_APP_HOST_URL}${MEMBER_VIEW}${data.id}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setMemberLoading(false);
                if (json.success) {
                    setProfileImage({
                        data: json.list.mapped_photo != null ? json.list.mapped_photo : "",
                        savedata: json.list.mapped_photo != null ? json.list.mapped_photo : "",
                        type: "server",
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

                    if (json.list && json.list.address) {
                        setAddressDetailEmpty("");
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
                        const statedata = StateList && StateList.length > 0 ? StateList[0].state_name : "";
                        setState({
                            data: json.list.address.state != null ? json.list.address.state : statedata,
                            error: ""
                        });
                        const countrydata = CountryList && CountryList.length > 0 ? CountryList[0].country_name : "";
                        setCountry({
                            data: json.list.address.country != null ? json.list.address.country : countrydata,
                            error: ""
                        });
                    } else {
                        setAddressDetailEmpty("no_data");
                    }

                    if (json.list && json.list.bankDetails) {
                        setBankDetailEmpty("");
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
                        setEducationDetailEmpty("");
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
                        setOccupationDetailEmpty("");
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
                    if (screen === "add" || screen === "edit") {
                        GetCountryList()
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
                // console.log(error);
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
        "mapped_photo": screen === "add" ? "" : ProfileImage.savedata,
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
            if (screen === "add" || TabIndex === '1') {
                url = `${REACT_APP_HOST_URL}${MEMBER_ADD}`;
                Params = MemberInfoParams;
            }
            if (TabIndex === '2') {
                url = `${REACT_APP_HOST_URL}${MEMBER_ADDRESS_SAVE}`;
                Params = AddressDetailParams;
            } else if (TabIndex === '3') {
                url = `${REACT_APP_HOST_URL}${MEMBER_BANK_DETAIL_SAVE}`;
                Params = BankDetailParams;
            } else if (TabIndex === '4') {
                url = `${REACT_APP_HOST_URL}${MEMBER_EDUCATION_DETAIL_SAVE}`;
                Params = EducationDetailParams;
            } else if (TabIndex === '5') {
                url = `${REACT_APP_HOST_URL}${MEMBER_OCCUPATION_DETAIL_SAVE}`;
                Params = OccupationDetailParams;
            }
            // console.log(JSON.stringify(Params) + url);
            fetch(url, PostHeader(JSON.parse(Session), Params))
                .then((response) => response.json())
                .then((json) => {
                    // console.log(JSON.stringify(json));
                    setLoading(false);
                    setScreenRefresh(0);
                    if (json.success) {
                        setAlertMessage(json.message);
                        setMemberSaveId({
                            id: json.id
                        })
                        if (screen === "add" || TabIndex === '1') {
                            setAlertFrom("add_success");
                        } else {
                            setAlertFrom("success");
                        }
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

    const MemberUpdateMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            let url = '';
            let Params = '';
            if (TabIndex === '1') {
                url = `${REACT_APP_HOST_URL}${MEMBER_UPDATE}${data.id}`;
                Params = MemberInfoParams;
            } else if (TabIndex === '2') {
                url = `${REACT_APP_HOST_URL}${MEMBER_ADDRESS_UPDATE}${AddressId}`;
                Params = AddressDetailParams;
            } else if (TabIndex === '3') {
                url = `${REACT_APP_HOST_URL}${MEMBER_BANK_DETAIL_UPDATE}${BankId}`;
                Params = BankDetailParams;
            } else if (TabIndex === '4') {
                url = `${REACT_APP_HOST_URL}${MEMBER_EDUCATION_DETAIL_UPDATE}${EducationId}`;
                Params = EducationDetailParams;
            } else if (TabIndex === '5') {
                url = `${REACT_APP_HOST_URL}${MEMBER_OCCUPATION_DETAIL_UPDATE}${OccupationId}`;
                Params = OccupationDetailParams;
            }
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

    const GetMediaList = (entryMappedtypeNo, file) => {
        setMediaListLoading(true);
        const url = `${REACT_APP_HOST_URL}${MEMBER_MEDIA_LIST}${data.id}&entryMappedtypeNo=${entryMappedtypeNo}`;
        // console.log(JSON.parse(Session) + url);;
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setMediaListLoading(false);
                if (json.success) {
                    if (json.list.length > 0) {
                        setProfileMediaId(json.list[0].id);
                        if (entryMappedtypeNo !== "") {
                            if (file !== "") {
                                MemberImageUpload(file, "MEMBER_PROFILE");
                            }
                        }
                    } else {
                        MemberImageUpload(file, "MEMBER_PROFILE");
                    }
                    setMediaList(json.list);
                } else if (json.success === false) {
                    setProfileUploadLoading(false);
                    setAlertMessage(json.message);
                    setAlertFrom("failed");
                    HandleAlertShow();
                } else {
                    setProfileUploadLoading(false);
                    setErrorAlert(true);
                    setErrorScreen("network");
                }
            })
            .catch((error) => {
                setProfileUploadLoading(false);
                setMediaListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const MemberImageUpload = (fileToUpload, imagetype) => {
        if (fileToUpload != null && fileToUpload !== "") {
            const formData = new FormData();
            formData.append("uploaded_file", fileToUpload);
            const url = `${REACT_APP_HOST_URL}${MEMBER_IMAGE_UPLOAD}&type=${imagetype}&ref_id=${data.id}`;
            // console.log(formData);
            // console.log(JSON.parse(Session) + url);
            fetch(url, PostImageHeader(JSON.parse(Session), formData))
                .then((response) => response.json())
                .then((json) => {
                    // console.log(json);
                    setProfileUploadLoading(false);
                    if (json.success) {
                        if (imagetype === "MEMBER_PROFILE") {
                            setProfileImage({
                                data: json.uploaded_path,
                                savedata: json.uploaded_path,
                                type: "server",
                                error: ""
                            });
                            setAlertMessage(json.message);
                            setAlertFrom("media_success");
                            HandleAlertShow();
                        } else {
                            setProofImage({
                                data: json.uploaded_path,
                                savedata: json.uploaded_path,
                                type: "server",
                                error: ""
                            });
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
                    setProfileUploadLoading(false);
                    setErrorAlert(true);
                    setErrorScreen("error");
                    // console.log(error);
                });
        }
    };

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

    const MemberMediaSave = (IsValidate, imagepath) => {
        if (IsValidate && imagepath != null && imagepath !== "") {
            MediaSaveParams.path = imagepath.savedata;
            if (ProofType.data === "ID PROOF") {
                MediaSaveParams.entry_mappedtype = "ID_PROOF";
                MediaSaveParams.entry_mappedtypeno = 101;
                MediaSaveParams.name = ProofType.data;
            } else if (ProofType.data === "SIGNATURE PROOF") {
                MediaSaveParams.entry_mappedtype = "SIGNATURE";
                MediaSaveParams.entry_mappedtypeno = 103;
                MediaSaveParams.name = ProofType.data;
            } else if (ProofType.data === "KYC") {
                MediaSaveParams.name = KYCOtherType.data;
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
                MediaSaveParams.name = KYCOtherType.data;
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
            const url = `${REACT_APP_HOST_URL}${MEMBER_MEDIA_SAVE}`;
            // console.log(JSON.stringify(MediaSaveParams) + url);
            fetch(url, PostHeader(JSON.parse(Session), MediaSaveParams))
                .then((response) => response.json())
                .then((json) => {
                    // console.log(JSON.stringify(json));
                    setProofLoading(false);
                    if (json.success) {
                        setProofAlert(false);
                        setProofImage({
                            data: "",
                            savedata: "",
                            type: "",
                            error: ""
                        });
                        setProofType({
                            data: ProofArray[0],
                            error: ""
                        });
                        setKYCOtherType({
                            data: "",
                            error: ""
                        });
                        setScreenRefresh(0);
                        GetMediaList("", "");
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
                    setProofLoading(false);
                    setErrorAlert(true);
                    setErrorScreen("error");
                    // console.log(error);
                })
        }
    }

    const MemberDeleteMedia = (from, id, IsValidate) => {
        const url = `${REACT_APP_HOST_URL}${MEMBER_MEDIA_DELETE}${id}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, DeleteHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                if (json.success) {
                    if (from === "1") {
                        MemberUpdateMethod(IsValidate);
                    } else {
                        setAlertMessage(json.message);
                        setAlertFrom("remove_success");
                        HandleAlertShow();
                        GetMediaList("", "");
                    }
                } else if (json.success === false) {
                    setProfileUploadLoading(false);
                    setAlertMessage(json.message);
                    setAlertFrom("failed");
                    HandleAlertShow();
                } else {
                    setProfileUploadLoading(false);
                    setErrorAlert(true);
                    setErrorScreen("network");
                }
            })
            .catch((error) => {
                setProfileUploadLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetStateList = (countryname) => {
        const url = `${REACT_APP_HOST_URL}${STATE_LIST}${countryname}`;
        // console.log(JSON.parse(Session) + url);;
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                if (json.success) {
                    setStateList(json.list);
                    /* if (State.data === "") {
                        setState({
                            data: json.list && json.list.length > 0 ? json.list[0].state_name : "",
                            error: ""
                        });
                    } */
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
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetCountryList = () => {
        const url = `${REACT_APP_HOST_URL}${COUNTRY_LIST}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                if (json.success) {
                    setCountryList(json.list);
                    if (Country.data === "") {
                        setCountry({
                            data: json.list && json.list.length > 0 ? json.list[0].country_name : "",
                            error: ""
                        });
                    }
                    GetStateList(json.list[0].country_name);
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
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    /* const MediaList1 = [
        { id: 1, image: "https://cdn.dummyjson.com/product-images/1/1.jpg", },
        { id: 2, image: "https://cdn.dummyjson.com/product-images/2/1.jpg", },
        { id: 3, image: "https://cdn.dummyjson.com/product-images/3/1.jpg", },
        { id: 4, image: "https://cdn.dummyjson.com/product-images/4/1.jpg", },
        { id: 5, image: "https://cdn.dummyjson.com/product-images/5/1.jpg", }
    ] */

    const MemberInfoTextValidate = (e, from) => {
        const text = e.target.value;
        setScreenRefresh(pre => pre + 1);
        // console.log(from);
        if (from === "NamePrefix") {
            setNamePrefix(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "MemberName") {
            setMemberName(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "RelationPrefix") {
            setRelationPrefix(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Relationship") {
            setRelationship(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Gender") {
            setGender(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" || text.trim() === "Select" ? "" : ""
            }));
        } else if (from === "MobileNumber") {
            setMobileNumber(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Dob") {
            setDob(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                datesave: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "Email") {
            const newError = isValidEmail(text) ? "" : "* Invalid Email";
            setEmail(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : newError
            }));
        } else if (from === "WhatsappNo") {
            setWhatsappNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "GuardName") {
            setGuardName(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "GuardRelationship") {
            setGuardRelationship(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "AadharNo") {
            setAadharNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "PancardNo") {
            setPancardNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
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
        /* if (!Gender.data || Gender.data === "Select") {
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
        } */
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
        /* if (!Dob.data) {
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
        } */

        /* if(screen === "edit"){
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
        } */
        if (screen === "add") {
            MemberAddMethod(IsValidate);
        }
        if (screen === "edit") {
            if (ProfileMediaId !== "") {
                MemberDeleteMedia("1", ProfileMediaId, IsValidate);
            } else {
                MemberUpdateMethod(IsValidate);
            }

        }

    }

    const AddressDetailsTextValidate = (e, from) => {
        const text = e.target.value;
        setScreenRefresh(pre => pre + 1);
        // console.log(from);
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
            GetStateList(text);
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
        /* if (!AreaName.data) {
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
        } */
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
        // console.log(AddressDetailEmpty);
        if (AddressDetailEmpty === "no_data") {
            MemberAddMethod(IsValidate);
        } else {
            MemberUpdateMethod(IsValidate);
        }
    }

    const BankDetailsTextValidate = (e, from) => {
        const text = e.target.value;
        setScreenRefresh(pre => pre + 1);
        // console.log(from);
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
                error: text.trim() === "" ? "" : ""
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
        /* if (!UPI.data) {
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
        } */
        console.log(BankDetailEmpty)
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
        if (MaritalStatus.data === "Married" || MaritalStatus.data === "Married With Kids") {
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
        if (ProofType.data === "KYC" || ProofType.data === "OTHERS") {
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
        if (IsValidate) {
            setProofLoading(true);
            MemberMediaSave(IsValidate, ProofImage)
        }
    }

    const OccupationDetailsTextValidate = (e, from) => {
        const text = e.target.value;
        setScreenRefresh(pre => pre + 1);
        // console.log(from);
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
        setAlertOpen(true);
    };

    const HandleAlertClose = () => {
        setAlertOpen(false);
        if (AlertFrom === "success") {
            GetMemberView();
            GetMediaList("", "");
            // window.location.reload();
        } else if (AlertFrom === "add_success") {
            // navigate('/member/list');
            console.log(MemberSaveId);
            navigate(`/member/edit/${MemberSaveId.id}`, {
                state: {
                    screen: 'edit',
                    data: MemberSaveId,
                },
            });
        }
    };

    const handleChange = (event, newValue) => {
        if (ScreenRefresh) {
            const confirmNavigation = window.confirm(
                'You have unsaved changes. Are you sure you want to leave this Tab?'
            );
            if (confirmNavigation) {
                setScreenRefresh(0);
                setTabIndex(newValue);
            }
        } else {
            setTabIndex(newValue);
        }
    };

    const HandleSubmitClick = () => {
        if (screen === "add" || TabIndex === '1') {
            validateMemberInfo();
        }
        if (TabIndex === '2') {
            validateAddressDetails();
        } else if (TabIndex === '3') {
            validateBankDetails();
        } else if (TabIndex === '4') {
            validateEducationDetails();
        } else if (TabIndex === '5') {
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
        const file = event.target.files[0];
        const fileSizeLimit = 1 * 1024 * 1024;
        console.log("file", file.size, " fileSizeLimit", fileSizeLimit);
        if (file.size > fileSizeLimit) {
            setAlertMessage("Please choose a file smaller than 1 MB.");
            setAlertFrom("upload_failed");
            HandleAlertShow();
        } else {
            setScreenRefresh(pre => pre + 1);
            const filePath = URL.createObjectURL(file);
            setProfileImage({
                data: filePath,
                savedata: "",
                type: "local",
                error: ""
            });
            if (ProfileImage.data !== "") {
                setProfileUploadLoading(true);
                GetMediaList("106", file);
            } else {
                MemberImageUpload(file, 'MEMBER_PROFILE');
            }
        }
    };

    const HandleProofImage = (event) => {
        setScreenRefresh(pre => pre + 1);
        const file = event.target.files[0];
        const fileSizeLimit = 1 * 1024 * 1024;
        console.log("file", file.size, " fileSizeLimit", fileSizeLimit);
        if (file.size > fileSizeLimit) {
            setAlertMessage("Please choose a file smaller than 1 MB.");
            setAlertFrom("upload_failed");
            HandleAlertShow();
        } else {
            const filePath = URL.createObjectURL(file);
            setProofImage({
                data: filePath,
                savedata: "",
                type: "local",
                error: ""
            });
            setProfileUploadLoading(true);
            MemberImageUpload(file, 'MEMBER_PROOF');
        }
    };

    const HandleProofAlertClose = () => {
        setProofAlert(false);
        setScreenRefresh(0);
        setProofImage({
            data: "",
            savedata: "",
            type: "",
            error: ""
        });
        setProofType({
            data: ProofArray[0],
            error: ""
        });
        setKYCOtherType({
            data: "",
            error: ""
        });
    };

    const HandleDateChange = (date) => {
        setScreenRefresh(pre => pre + 1);
        const DateForSave = dayjs(date).format('YYYY-MM-DD');
        // console.log('Date to save:', DateForSave);
        setDob({
            data: date,
            datesave: DateForSave,
            error: ""
        });
    };

    const HandleConfirmYesClick = () => {
        setConfirmAlert(false);
        MemberDeleteMedia("", MediaId, true)
    };

    const HandleBack = () => {
        if (ScreenRefresh) {
            const confirmNavigation = window.confirm(
                'You have unsaved changes. Are you sure you want to leave this page?'
            );
            if (confirmNavigation) {
                setScreenRefresh(0);
                navigate('/member/list');
            }
        } else {
            navigate('/member/list');
        }
    }

    const currentDate = dayjs();
    const maxDate = currentDate.subtract(18, 'year');

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    const screenLabel = {
        add: "Add Member",
        view: "View Member",
        edit: "Edit Member",
    };

    return (
        <Container>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 2, mb: 2 }}>
                    {screenLabel[screen] || "Add Member"}
                </Typography>
                <Button variant="contained" className='custom-button' onClick={HandleBack} sx={{ cursor: 'pointer' }}>
                    Back
                </Button>
            </Stack>
            <Card>
                <Box component="form"
                    sx={{ '& .MuiTextField-root': { m: 2, width: '20ch', }, }}
                    noValidate
                    autoComplete="off">
                    <Stack direction='column'>
                        <TabContext value={TabIndex}>
                            {screen === "add"
                                ? <Typography className="inf" variant="subtitle1" sx={{ ml: 4, mr: 5, mt: 3 }}>
                                    Member Information
                                </Typography>
                                : <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} aria-label="lab API tabs example"
                                        variant="scrollable" scrollButtons="auto">
                                        <Tab label="Member Information" value="1" />
                                        <Tab label="Address Details" value="2" />
                                        <Tab label="Bank Details" value="3" />
                                        <Tab label="Education Details" value="4" />
                                        <Tab label="Occupation Details" value="5" />
                                        <Tab label="Proof Details" value="6" />
                                    </TabList>
                                </Box>}
                            {MemberLoading
                                ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                                    <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                </Stack>
                                : <TabPanel value="1">
                                    {screen === "add"
                                        ? null
                                        : <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column' sx={{ ml: 2, }}>
                                                {ProfileImage.data !== ""
                                                    ? <div>
                                                        <img src={ProfileImage.type === "local" ? `${ProfileImage.data}` : `${ImageUrl.STORAGE_NAME}${ImageUrl.BUCKET_NAME}/${ProfileImage.data}`} alt="Loading" style={{ width: 100, height: 100, }} />
                                                    </div>
                                                    : <div>
                                                        <img src="/assets/images/img/placeholder.png" alt="Loading" style={{ width: 100, height: 100, }} />
                                                    </div>}
                                                <Button component="label" variant="contained" tabIndex={-1} sx={{ width: 130, height: 40, mt: 2 }}>
                                                    Upload Photo
                                                    <VisuallyHiddenInput type="file" onChange={HandleProfileImage} />
                                                </Button>
                                                <div style={{ marginLeft: "10px", marginTop: "0px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{ProfileImage.error}</div>
                                            </Stack>
                                         </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    PanCard Number
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        // required
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Pancard Number"
                                                        value={PancardNo.data}
                                                        onChange={(e) => MemberInfoTextValidate(e, "PancardNo")}
                                                        style={{}} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{PancardNo.error}</div>
                                            </Stack>
                                        </div>
                                      
                                        </Stack>}
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Member Name <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box'
                                                        id="outlined-select-currency"
                                                        select
                                                        disabled={screen === "view"}
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
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
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
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Relationship Name <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box'
                                                        id="outlined-select-currency"
                                                        select
                                                        disabled={screen === "view"}
                                                        variant="outlined"
                                                        value={RelationPrefix.data}
                                                        onChange={(e) => MemberInfoTextValidate(e, "RelationPrefix")}
                                                        style={{ width: 90, marginRight: -10 }} >
                                                        {RelationShipPrefix.map((option) => (
                                                            <MenuItem key={option} value={option.value}>
                                                                {option.data}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Relationship"
                                                        value={Relationship.data}
                                                        onChange={(e) => MemberInfoTextValidate(e, "Relationship")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }} className='req'>{Relationship.error || RelationPrefix.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Gender
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-select-currency"
                                                        select
                                                        disabled={screen === "view"}
                                                        label="Select"
                                                        variant="outlined"
                                                        value={Gender.data}
                                                        onChange={(e) => MemberInfoTextValidate(e, "Gender")} >
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
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Mobile Number <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Mobile Number"
                                                        value={MobileNumber.data}
                                                        onChange={(e) => MemberInfoTextValidate(e, "MobileNumber")}
                                                        type='number' />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{MobileNumber.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Date of Birth
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker']} sx={{ width: 550 }} className="date-pick">
                                                            <DatePicker
                                                                className="date-picker-width"
                                                                value={Dob.data}
                                                                onChange={HandleDateChange}
                                                                format="DD-MM-YYYY"
                                                                maxDate={maxDate}
                                                                renderInput={(params) => <TextField {...params} />} />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Dob.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Email
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Email"
                                                        value={Email.data}
                                                        onChange={(e) => MemberInfoTextValidate(e, "Email")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{Email.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Whatsapp Number
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Whatsapp Number"
                                                        value={WhatsappNo.data}
                                                        onChange={(e) => MemberInfoTextValidate(e, "WhatsappNo")}
                                                        type='number' />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{WhatsappNo.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Guardian Name
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Guardian Name"
                                                        value={GuardName.data}
                                                        onChange={(e) => MemberInfoTextValidate(e, "GuardName")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{GuardName.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box' >
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Guardian Relation
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Guardian Relation"
                                                        value={GuardRelationship.data}
                                                        onChange={(e) => MemberInfoTextValidate(e, "GuardRelationship")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GuardRelationship.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box' >
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Aadhar Number
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Aadhar Number"
                                                        value={AadharNo.data}
                                                        onChange={(e) => MemberInfoTextValidate(e, "AadharNo")} />
                                                </Stack>
                                                <div style={{ marginTop: "-10px", marginLeft: "25px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{AadharNo.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                  
                                </TabPanel>}
                            {MemberLoading
                                ? null
                                : <TabPanel value="2">
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Address <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Address"
                                                        value={Address.data}
                                                        onChange={(e) => AddressDetailsTextValidate(e, "Address")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Address.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box' style={{display: 'none'}}>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Area Name <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Area Name"
                                                        value={AreaName.data}
                                                        onChange={(e) => AddressDetailsTextValidate(e, "AreaName")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{AreaName.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mt: 2, }}>
                                                    City <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="City"
                                                        value={City.data}
                                                        onChange={(e) => AddressDetailsTextValidate(e, "City")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{City.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2, mr: 2, mb: '0px' }} >
                                                    Country <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-select-currency"
                                                        select
                                                        disabled={screen === "view"}
                                                        label="Select"
                                                        variant="outlined"
                                                        value={Country.data}
                                                        onChange={(e) => AddressDetailsTextValidate(e, "Country")} >
                                                        {CountryList.map((option) => (
                                                            <MenuItem key={option} value={option.country_name}>
                                                                {option.country_name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Stack>
                                                <div style={{ marginTop: "-10px", marginLeft: "25px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Country.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    State <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-select-currency"
                                                        select
                                                        disabled={screen === "view"}
                                                        label="Select"
                                                        variant="outlined"
                                                        value={State.data}
                                                        onChange={(e) => AddressDetailsTextValidate(e, "State")} >
                                                        {StateList.map((option) => (
                                                            <MenuItem key={option} value={option.state_name}>
                                                                {option.state_name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{State.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                </TabPanel>}
                            {MemberLoading
                                ? null
                                : <TabPanel value="3">
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Name on Account <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Name on Account"
                                                        value={NameOnAccount.data}
                                                        onChange={(e) => BankDetailsTextValidate(e, "NameOnAccount")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{NameOnAccount.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Account Number <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Account Number"
                                                        value={AccountNumber.data}
                                                        onChange={(e) => BankDetailsTextValidate(e, "AccountNumber")} />
                                                </Stack>
                                                <div style={{ marginTop: "-10px", marginLeft: "25px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{AccountNumber.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    IFSC Code <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="IFSC Code"
                                                        value={IFSCCode.data}
                                                        onChange={(e) => BankDetailsTextValidate(e, "IFSCCode")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{IFSCCode.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Type of Account <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-select-currency"
                                                        select
                                                        disabled={screen === "view"}
                                                        label="Select"
                                                        variant="outlined"
                                                        value={TypeOfAccount.data}
                                                        onChange={(e) => BankDetailsTextValidate(e, "TypeOfAccount")} >
                                                        {TypeOfAccountArray.map((option) => (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{TypeOfAccount.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Bank Name <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Bank Name"
                                                        value={BankName.data}
                                                        onChange={(e) => BankDetailsTextValidate(e, "BankName")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{BankName.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Branch <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Branch"
                                                        value={Branch.data}
                                                        onChange={(e) => BankDetailsTextValidate(e, "Branch")} />
                                                </Stack>
                                                <div style={{ marginTop: "-10px", marginLeft: "25px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Branch.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    UPI
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="UPI"
                                                        value={UPI.data}
                                                        onChange={(e) => BankDetailsTextValidate(e, "UPI")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{UPI.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                </TabPanel>}
                            {MemberLoading
                                ? null
                                : <TabPanel value="4">
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 3, mr: 2, mt: 2, mb: 1 }}>
                                                    Education <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }} className='radio-box'>
                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        defaultValue="female"
                                                        name="radio-buttons-group"
                                                        row
                                                        value={Education.data}
                                                        onChange={(e) => { setEducation({ data: e.target.value, error: "" }); setScreenRefresh(pre => pre + 1); }}>
                                                        <FormControlLabel value="Primary" control={<Radio />} label="Primary" disabled={screen === "view"} />
                                                        <FormControlLabel value="Secondary" control={<Radio />} label="Secondary" disabled={screen === "view"} />
                                                        <FormControlLabel className="radio-control2" value="Diploma" control={<Radio />} label="Diploma" disabled={screen === "view"} />
                                                        <FormControlLabel value="Graduate" control={<Radio />} label="Graduate" disabled={screen === "view"} />
                                                        <FormControlLabel className="radio-control" value="Post Graduate" control={<Radio />} label="Post Graduate" disabled={screen === "view"} />
                                                        <FormControlLabel className="radio-control1" value="Doctrate" control={<Radio />} label="Doctorate" onChange={() => setEducation('Doctrate')} disabled={screen === "view"} />
                                                    </RadioGroup>
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "0px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Education.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 3, mr: 2, mt: 2, mb: 1 }}>
                                                    Marital Status <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }} className='radio-box'>
                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        defaultValue="female"
                                                        name="radio-buttons-group"
                                                        row
                                                        value={MaritalStatus.data}
                                                        onChange={(e) => { setMaritalStatus({ data: e.target.value, error: "" }); setScreenRefresh(pre => pre + 1); }}>
                                                        <FormControlLabel value="Single" control={<Radio />} label="Single" disabled={screen === "view"} />
                                                        <FormControlLabel  value="Married" control={<Radio />} label="Married" disabled={screen === "view"} />
                                                        <FormControlLabel value="Married With Kids" control={<Radio />} label="Married with Kids" disabled={screen === "view"} />
                                                        <FormControlLabel value="Divorced" control={<Radio />} label="Divorced" disabled={screen === "view"} />
                                                        <FormControlLabel className="radio-control3" value="Separated" control={<Radio />} label="Separated" disabled={screen === "view"} />
                                                    </RadioGroup>
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "0px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{MaritalStatus.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    {MaritalStatus.data === "Married" || MaritalStatus.data === "Married With Kids"
                                        ? <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                            <div className='box'>
                                                <Stack direction='column'>
                                                    <Typography variant="subtitle1" sx={{ ml:3, mr: 2, mt: 2, mb: 1 }}>
                                                        Spouse Education <span style={{ color: 'red' }}> *</span>
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 0, }}  className='radio-box'>
                                                        <RadioGroup
                                                            aria-labelledby="demo-radio-buttons-group-label"
                                                            name="radio-buttons-group"
                                                            row
                                                            value={SpouseEducation.data}
                                                            onChange={(e) => { setSpouseEducation({ data: e.target.value, error: "" }); setScreenRefresh(pre => pre + 1); }}>
                                                            <FormControlLabel value="Primary" control={<Radio />} label="Primary" disabled={screen === "view"} />
                                                            <FormControlLabel value="Secondary" control={<Radio />} label="Secondary" disabled={screen === "view"} />
                                                            <FormControlLabel className="radio-control2" value="Diploma" control={<Radio />} label="Diploma" disabled={screen === "view"} />
                                                            <FormControlLabel value="Graduate" control={<Radio />} label="Graduate" disabled={screen === "view"} />
                                                            <FormControlLabel className="radio-control" value="Post Graduate" control={<Radio />} label="Post Graduate" disabled={screen === "view"} />
                                                            <FormControlLabel className="radio-control1" value="Doctrate" control={<Radio />} label="Doctorate" disabled={screen === "view"} />
                                                        </RadioGroup>
                                                    </Stack>
                                                    <div style={{ marginLeft: "25px", marginTop: "-20px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{SpouseEducation.error}</div>
                                                </Stack>
                                            </div>
                                        </Stack>
                                        : null}
                                </TabPanel>}
                            {MemberLoading
                                ? null
                                : <TabPanel value="5">
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Current Occupation <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-select-currency"
                                                        select
                                                        disabled={screen === "view"}
                                                        label="Select"
                                                        variant="outlined"
                                                        value={CurrentOccupation.data}
                                                        onChange={(e) => OccupationDetailsTextValidate(e, "CurrentOccupation")} >
                                                        {CurrentOccupationArray.map((option) => (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{CurrentOccupation.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Current Employer <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Current Employer"
                                                        value={CurrentEmployer.data}
                                                        onChange={(e) => OccupationDetailsTextValidate(e, "CurrentEmployer")} />
                                                </Stack>
                                                <div style={{ marginLeft: "15px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{CurrentEmployer.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box' >
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Years at Current Employer <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Years at Current Employer"
                                                        value={YearsAtCurrentEmployer.data}
                                                        onChange={(e) => OccupationDetailsTextValidate(e, "YearsAtCurrentEmployer")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{YearsAtCurrentEmployer.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Monthly Income <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Monthly Income"
                                                        value={MonthlyIncome.data}
                                                        onChange={(e) => OccupationDetailsTextValidate(e, "MonthlyIncome")} />
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }} className='req'>{MonthlyIncome.error}</div>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Living in Rented House/Own House <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 2, mt: 2 }}>
                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        defaultValue="female"
                                                        name="radio-buttons-group"
                                                        row
                                                        value={LivingIn.data}
                                                        onChange={(e) => setLivingIn({ data: e.target.value, error: "" })}>
                                                        <FormControlLabel value="0" control={<Radio />} label="Rented House" disabled={screen === "view"} />
                                                        <FormControlLabel value="1" control={<Radio />} label="Own House" disabled={screen === "view"} />
                                                    </RadioGroup>
                                                </Stack>
                                                <div style={{ marginLeft: "25px", marginTop: "-5px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{LivingIn.error}</div>
                                            </Stack>
                                        </div>
                                        <div className='box'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Years at Current Residence <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        label="Years at Current Residence"
                                                        value={YearsAtCurrentResidence.data}
                                                        onChange={(e) => OccupationDetailsTextValidate(e, "YearsAtCurrentResidence")} />
                                                </Stack>
                                            </Stack>
                                            <div style={{ marginLeft: "25px",marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{YearsAtCurrentResidence.error}</div>
                                        </div>
                                    </Stack>
                                </TabPanel>}
                            {MemberLoading
                                ? null
                                : <TabPanel value="6">
                                    <Stack direction='column' spacing={2}>
                                        {screen === "view"
                                            ? null
                                            : <Stack spacing={2} style={{ justifyContent: 'flex-end' }}>
                                                <Button component="label" variant="contained" tabIndex={-1} sx={{ width: 130, height: 30, cursor: 'pointer' }} onClick={() => setProofAlert(true)}>
                                                    Choose Photo
                                                </Button>
                                            </Stack>}
                                        <Stack direction='row' spacing={2} sx={{ mb: 3, mt: 2, mr: 3 }} className='row-box'>
                                            {MediaListLoading
                                                ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                                                    <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                                </Stack>
                                                : MediaList.map((row) => (
                                                    <Stack direction='column' sx={{ ml: 2 }} key={row.id} className='boxing'>
                                                        {row.path
                                                            ? <Stack direction='row' sx={{ ml: 0 }} className='image-top'>
                                                                <div className='img-box' style={{ width: 120, height: 120 }}>
                                                                    <img src={`${ImageUrl.STORAGE_NAME}${ImageUrl.BUCKET_NAME}/${row.path}`} alt="Loading" style={{ width: '100% ', height: '100% ' }} />
                                                                </div>
                                                                {screen === "view"
                                                                    ? null
                                                                    : <Button onClick={() => { setMediaId(row.id); setConfirmAlert(true); }} className='btn-click' sx={{ cursor: 'pointer' }}>
                                                                        <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 12, height: 12 }} />
                                                                    </Button>}
                                                            </Stack>
                                                            : <Stack>
                                                                <div className='img-box' style={{ width: 100, height: 100 }}>
                                                                    <img src="/assets/images/img/placeholder.png" alt="Loading" style={{ width: '100% ' }} />
                                                                </div>
                                                            </Stack>}
                                                        {row.name
                                                            ? <Typography variant="subtitle1" sx={{ ml: 3, mr: 2, mt: 0, mb: '-5px' }}>
                                                                {row.name}
                                                            </Typography>
                                                            : null}
                                                    </Stack>
                                                ))}
                                        </Stack>
                                    </Stack>
                                </TabPanel>}
                        </TabContext>
                        {!MemberLoading && (screen === "view" || TabIndex === "6"
                            ? null
                            : <Stack direction='column' alignItems='flex-end'>
                                <Button sx={{ mr: 5, mb: 3, height: 50, width: 150, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={Loading ? null : HandleSubmitClick}>
                                    {Loading
                                        ? (<img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                        : ("Submit")}
                                </Button>
                            </Stack>)}
                    </Stack>
                </Box>
            </Card>
            <Snackbar open={AlertOpen} autoHideDuration={AlertFrom === "failed" || AlertFrom === "upload_failed" ? 2000 : 1000} onClose={HandleAlertClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center', }} sx={{ mt: '60px' }}>
                <Alert
                    onClose={HandleAlertClose}
                    severity={AlertFrom === "failed" || AlertFrom === "upload_failed" ? "error" : "success"}
                    variant="filled"
                    sx={{ width: '100%' }} >
                    {AlertMessage}
                </Alert>
            </Snackbar>
            <Dialog
                open={ProfileUploadLoading}
                onClose={() => setProfileUploadLoading(false)}
                fullWidth={500}
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }} >
                <Stack style={{ alignItems: 'center' }} mt={5} mb={5}>
                    <img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 70, height: 70 }} />
                </Stack>
            </Dialog>
            <Dialog
                open={ProofAlert}
                fullWidth={500}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <IconButton
                    aria-label="close"
                    onClick={HandleProofAlertClose}
                    sx={{ position: 'absolute', right: 15, top: 20, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }} >
                    <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 17, height: 17, }} />
                </IconButton>
                <Stack flexDirection='row' sx={{ mt: 3, ml: 3 }}>
                    <Button component="label" variant="contained" tabIndex={-1} sx={{ width: 130, height: 40 }}>
                        Upload Proof
                        <VisuallyHiddenInput type="file" onChange={HandleProofImage} />
                    </Button>
                </Stack>
                <Stack sx={{ mt: 2, ml: 3 }}>
                    <Stack direction='row'>
                        {ProofImage.data
                            ? <img src={ProofImage.type === "local" ? `${ProofImage.data}` : `${ImageUrl.STORAGE_NAME}${ImageUrl.BUCKET_NAME}/${ProofImage.data}`} alt="Loading" style={{ width: 120, height: 120, }} />
                            : <img src="/assets/images/img/image_placeholder.png" alt="Loading" style={{ width: 120, height: 120, }} />}
                        <Stack flexDirection='column' sx={{ ml: 3, }}>
                            <Stack flexDirection='row'>
                                <TextField
                                    className='dialog'
                                    id="outlined-select-currency"
                                    select
                                    variant="outlined"
                                    value={ProofType.data}
                                    onChange={(e) => {
                                        setProofType({ data: e.target.value, error: "" });
                                        const KYCOtherTypeData = e.target.value === "OTHERS" ? OtherArray[0] : "";
                                        setKYCOtherType({ data: e.target.value === "KYC" ? KYCArray[0] : KYCOtherTypeData, error: "" })
                                    }}
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
                                ? <Stack flexDirection='row' sx={{ mt: 1 }}>
                                    <TextField
                                        id="outlined-select-currency"
                                        className='dialog'
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
                    <div style={{ marginLeft: "8px", color: 'red', fontSize: "12px", marginTop: "3px", fontWeight: "500", width: "100px" }}>{ProofImage.error}</div>
                </Stack>
                <Stack sx={{ alignItems: 'center', mt: 1, mb: 3 }}>
                    <Button component="label" variant="contained" tabIndex={-1} sx={{ width: 100, height: 40, cursor: 'pointer' }} onClick={ProofLoading ? null : validateProofDetails}>
                        {ProofLoading
                            ? (<img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                            : ("Save")}
                    </Button>
                </Stack>
            </Dialog>
            <Dialog
                open={ConfirmAlert}
                maxWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <DialogTitle id="responsive-dialog-title">
                    Are you sure you want to delete this Proof ?
                </DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={HandleConfirmYesClick} sx={{ cursor: 'pointer' }}>
                        Yes
                    </Button>
                    <Button onClick={() => setConfirmAlert(false)} autoFocus sx={{ cursor: 'pointer' }}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
