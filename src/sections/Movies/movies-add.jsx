import { Box, Button, Card, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './group-new-add.css';
import Iconify from "src/components/iconify";


export default function AddGroupNew() {
    const navigate = useNavigate();
    const location = useLocation();
    const [empList, setEmpList] = useState([]);
    const { screen, data } = location.state || {};


    const [name, setName] = useState({
        data: screen === "add" ? "" : data?.name,
        error: ""
    });
    const [role, setRole] = useState({
        data: screen === "add" ? "" : data?.role,
        error: ""
    });
    const [age, setAge] = useState({
        data: screen === "add" ? "" : data?.age,
        error: ""
    });
    const [relatives, setRelatives] = useState(data?.relatives || [{ }]);
    // const [relatives, setRelatives] = useState(data?.relatives || [{ name: '', relationship: '', age: '' }]);


    useEffect(() => {
        const emp = JSON.parse(localStorage.getItem('emplist')) || [];
        setEmpList(emp);
    }, []);


    const TextValidate = (e, from) => {
        const text = e.target.value;
        if (from === "name") {
            setName(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "role") {
            setRole(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "age") {
            setAge(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        }
    };


    const handleRelativeChange = (index, field, value) => {
        const updatedRelatives = relatives.map((relative, i) =>
            i === index ? { ...relative, [field]: value } : relative
        );
        setRelatives(updatedRelatives);
    };


    const addRelativeField = () => {    
        setRelatives(prevRelatives => [...prevRelatives, { name: '', relationship: '', age: '' }]);
    };




    const removeRelativeField = (index) => {
        setRelatives(relatives.filter((_, i) => i !== index));
    };


    const validateRelatives = () => {
        let isValid = true;
        const newRelatives = relatives.map(relative => {
            let relativeErrors = { nameError: '', relationshipError: '' };
            if (!relative.name) {
                relativeErrors.nameError = "* Required";
                isValid = false;
            }
            if (!relative.relationship) {
                relativeErrors.relationshipError = "* Required";
                isValid = false;
            }
            return { ...relative, ...relativeErrors };
        });
        setRelatives(newRelatives);
        return isValid;
    };


    const validateGroupInfo = () => {
        let isGroupValid = true;
        if (!name.data) {
            isGroupValid = false;
            setName(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setName(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!role.data) {
            isGroupValid = false;
            setRole(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setRole(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!age.data) {
            isGroupValid = false;
            setAge(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAge(prevState => ({
                ...prevState,
                error: ""
            }));
        }


        isGroupValid = validateRelatives() && isGroupValid;


        if (isGroupValid) handleSubmit(true);




        if (screen === "edit") {
            if (isGroupValid) handleEditSubmit(true);
        } else {
            if (isGroupValid) handleSubmit(true);
        }


    };


    const handleSubmit = (IsValidate) => {
        if (IsValidate) {
            const empId = empList.length ? empList.length + 1 : 1;
            const newEmployee = {
                id: empId,
                name: name.data,
                role: role.data,
                age: age.data,
                relatives: (relatives)// Add relatives to employee object
            };
            const newList = [...empList, newEmployee];
            setEmpList(newList);
            localStorage.setItem('emplist', JSON.stringify(newList));
            navigate('/group-new/list');
            console.log(newList)
        }
    };


    // const handleSubmit = () => {
    //     const isValid = validateGroupInfo();
    //     if (isValid) {
    //         const empId = empList.length ? empList.length + 1 : 1;
    //         const newEmployee = {
    //             id: empId,
    //             name: name.data,
    //             role: role.data,
    //             age: age.data,
    //             relatives: relatives // Add relatives to employee object
    //         };
    //         const newList = [...empList, newEmployee];
    //         setEmpList(newList);
    //         localStorage.setItem('emplist', JSON.stringify(newList));
    //         navigate('/group-new/list');
    //     }
    // };
//     const handleEditSubmit = (IsValidate) => {
//         if (IsValidate) {
//             const empId=employee ? employee.id:empList.length + 1;
//             // const empId = empList.length ? empList.length + 1 : 1;
//             const newEmployee = {
//                 id: empId,
//                 name: name.data,
//                 role: role.data,
//                 age: age.data,
//                 relatives: (relatives)// Add relatives to employee object
//             };
//             if (screen === 'edit') {
//                 const index = empList.findIndex(emp => emp.id === empId);
//                 const newEmpList = empList.map(emp =>
//                     emp.id === empId ? newEmployee : emp
//                 );
//             // const newList = [...empList, newEmployee];
//             setEmpList(newEmpList);
//             localStorage.setItem('emplist', JSON.stringify(newEmpList));
//             navigate('/group-new/list');
//             console.log(newEmpList)
//         }
//     };
// }


const handleEditSubmit = (IsValidate) => {
    if (IsValidate) {
        const empId = data?.id; // get the id from the employee being edited
        const newEmployee = {
            id: empId,
            name: name.data,
            role: role.data,
            age: age.data,
            relatives: relatives // Add relatives to employee object
        };


        if (screen === 'edit') {
            const index = empList.findIndex(emp => emp.id === empId); // find index of the employee
            const newEmpList = [...empList]; // create a copy of empList
            if (index !== -1) {
                newEmpList[index] = newEmployee; // update the employee details
                setEmpList(newEmpList);
                localStorage.setItem('emplist', JSON.stringify(newEmpList)); // update localStorage
                navigate('/group-new/list');
                console.log(newEmpList);
            }
        }
    }
};








    //     if (IsValidate) {
    //         const empId = empList.length ? empList.length + 1 : 1;
    //     const curItem = { id: empId, name: name.data, role: role.data, age: age.data, relatives: relatives };
    //     console.log(curItem, "cur Item");
    //     console.log(curItem)
    //     // if (Screen === 'edit') {
    //     //     const index = empList.findIndex(emp => emp.id === currentId);
    //     //     empList[index] = curItem;
    //     // }
    //     // else {
    //     //     movies.push(curItem);
    //     // }


    //     if (screen === 'edit') {
    //         const index = empList.findIndex(emp => emp.id === empId);
    //         const updatedEmpList = empList.map(emp =>
    //             emp.id === empId ? curItem : emp
    //         );
    //         console.log(updatedEmpList)
    //         empList[index] = updatedEmpList;
    //         setEmpList(updatedEmpList);
    //         console.log(updatedEmpList, "Updated Employee List");
    //         localStorage.setItem('emplist', JSON.stringify(updatedEmpList));
    //     }


    //     navigate('/group-new/list');
    // }
   
    return (
        <div className='group-add-screen'>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 3, ml: 3, mr: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: '600' }}>
                    Add Employee
                </Typography>
                <Button variant="contained" className='custom-button' sx={{ cursor: 'pointer', }} onClick={() => navigate('/group-new/list')}>
                    Back
                </Button>
            </Stack>
            <Card sx={{ mt: 2, mb: 3, ml: 3, mr: 3, pb: 3 }}>
                <Box className="con" component="form" noValidate autoComplete="off">
                    <Stack direction='column'>
                        <Stack direction="row">
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml: 4, mr: 2, mt: 2, mb: '0px' }}>
                                        Name<span style={{ color: 'red' }}> *</span>
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 2, mr: 2, mt: 1 }}>
                                        <TextField
                                            className='input-box1'
                                            value={name.data}
                                            disabled={screen === "view"}
                                            onChange={(e) => TextValidate(e, "name")}
                                            error={!!name.error}
                                            // helperText={name.error}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    fontSize: '14px',
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </div>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml: 4, mr: 2, mt: 2, mb: '0px' }}>
                                        Role <span style={{ color: 'red' }}> *</span>
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 2, mr: 2, mt: 1 }}>
                                        <TextField
                                            className='input-box1'
                                            value={role.data}
                                            onChange={(e) => TextValidate(e, "role")}
                                            error={!!role.error}
                                            disabled={screen === "view"}
                                            // helperText={role.error}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    fontSize: '14px',
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </div>
                        </Stack>
                        <Stack direction="row">
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml: 4, mr: 2, mt: 2, mb: '0px' }}>
                                        Age <span style={{ color: 'red' }}> *</span>
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 2, mr: 2, mt: 1 }}>
                                        <TextField
                                            className='input-box1'
                                            type="number"
                                            value={age.data}
                                            disabled={screen === "view"}
                                            onChange={(e) => TextValidate(e, "age")}
                                            error={!!age.error}
                                            // helperText={age.error}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    fontSize: '14px',
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </div>
                        </Stack>


                        {/* Relatives Section */}
                        {relatives.length > 0 && (
                            <>
                                <Typography variant="h6" sx={{ ml: 4, mt: 4 }}>
                                    Relatives
                                </Typography>
                                {relatives.map((relative, index) => (
                                    <Stack direction="row" spacing={2} key={index} sx={{ ml: 2, mt:1}}>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle" sx={{ ml: 2, mt:2 }}>Relative Name</Typography>
                                            <TextField
                                                className='input-box1'
                                                // label="Relative Name"
                                                disabled={screen === "view"}
                                                value={relative.name}
                                                onChange={(e) => handleRelativeChange(index, 'name', e.target.value)}
                                                error={!!relative.nameError}


                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                    }
                                                }}
                                            />
                                        </Stack>


                                        <Stack direction='column'>
                                            <Typography variant="subtitle" sx={{ ml: 2, mt:2}}>Relationship</Typography>
                                            <TextField
                                                className='input-box1'
                                                // label="Relationship"
                                                disabled={screen === "view"}
                                                value={relative.relationship}
                                                onChange={(e) => handleRelativeChange(index, 'relationship', e.target.value)}
                                                error={!!relative.relationshipError}


                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                    }
                                                }}
                                            />
                                        </Stack>


                                        <Stack direction='column'>
                                            <Typography variant="subtitle" sx={{ ml: 2, mt: 2 }}>Relative Age</Typography>
                                            <TextField
                                                className='input-box1'
                                                // label="Age"
                                                type="number"
                                                value={relative.age}
                                                disabled={screen === "view"}
                                                onChange={(e) => handleRelativeChange(index, 'age', e.target.value)}
                                                error={!!relative.ageError}
                                                helperText={relative.ageError}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                    }
                                                }}
                                            />
                                        </Stack>


                                        {screen === 'add' || screen === 'edit' ? <MenuItem
                                            variant="outlined"
                                            color="error"
                                            onClick={() => removeRelativeField(index)}
                                            sx={{ alignSelf: 'center', marginTop: "40px !important" }}
                                        >
                                        <Iconify icon="eva:trash-2-outline" sx={{ marginRight:'20px' ,color:"red"}}  />
               
                                      </MenuItem>
                                           
                                        : null}
                                    </Stack>
                                ))}
                            </>
                        )}


                    </Stack>
                    <Stack direction='column' alignItems='flex-start'>
                        {screen === 'add' || screen === 'edit' ? <Button
                            variant="contained"
                            color="primary"
                            onClick={addRelativeField}
                            sx={{ ml: 4, mt: 2 }}
                        >
                            Add Relative
                        </Button> : null}
                        {screen === "add" && <Button variant="contained" sx={{ ml: 4, mt: 5, cursor: 'pointer' }} onClick={validateGroupInfo}>Submit</Button>}
                        {screen === 'edit' && <Button variant="contained" sx={{ ml: 4, mt: 5, cursor: 'pointer' }} onClick={validateGroupInfo}>Submit</Button>}
{/* {screen==="add"|| screen==="edit" ?<Button variant="contained" sx={{ ml: 4, mt: 5, cursor: 'pointer' }} onClick={validateGroupInfo}>Submit</Button> : null} */}
                    </Stack>
                </Box>
            </Card>
        </div>
    );
}

