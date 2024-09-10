
import { useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';


import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';

import { LOGIN_URL, IMAGE_DISPLAY_URL, REACT_APP_HOST_URL } from 'src/utils/api-constant';
import { GetHeader, PostHeader } from 'src/hooks/AxiosApiFetch';

import { LogOutMethod } from 'src/utils/format-number';

import { UserContext } from 'src/context/UserContext';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors,setErrors] = useState({email:"",password:""});
    const [loadingAuthCheck, setLoadingAuthCheck] = useState(true);
    const navigate = useNavigate();
    const router = useRouter();
    const {token, setToken} = useContext(UserContext)

    const params = {
        "username": email,
        "password": password
    }

    useEffect(() => {
      if (localStorage.getItem('apiToken')) {
        router.push('/dashboard');
      } else {
        setLoadingAuthCheck(false); 
      }
    }, [router]);
    
    if (loadingAuthCheck) {
      return null; 
    }
    const validate = () =>{
        let newErrors = {email:"",password:""}
        let isError = true;
        if(!email.trim()){
            newErrors.email = "Email is Required"
            isError = false;
        }
        if(!password.trim()){
            newErrors.password = "Password is Required"
            isError = false;
        }
        setErrors(newErrors)
        return isError
    }
    const handleSubmit = () => {
        if (validate()) {
            setLoading(true);
            const URL = `${REACT_APP_HOST_URL}${LOGIN_URL}`;
            
            fetch(URL, PostHeader('', params))
                .then((response) => response.json())
                .then((json) => {
                    setLoading(false);
                    if (json.success) {
                        setLoading(false);
                        localStorage.setItem(
                            "apiToken",
                            JSON.stringify(json.apiToken)
                        );
                        
                        localStorage.setItem(
                            "userDetails",
                            JSON.stringify(json.userDetails)
                        );
                        getImage(json.apiToken)
                    } else if (!json.success) {
                        if (json.code === 2 || json.code === "2") {
                            LogOutMethod(navigate);
                        }else if(json.code === 1 || json.code === "1"){
                            if (json.message.toLowerCase().includes("password")) {
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    password: 'Password is wrong', 
                                }));
                            }
                            if (json.message.toLowerCase().includes("username")) {
                            setErrors((prevErrors) => ({
                                ...prevErrors,
                                email: 'Username is Wrong', 
                            }));
                        }
                        } 
                    }
                });
        }
    };
    
    const getImage = (Session) =>{
        const URL =`${REACT_APP_HOST_URL}${IMAGE_DISPLAY_URL}`
     fetch(URL, GetHeader(Session))
     .then((response)=>response.json())
     .then((json)=>{
        if(json.success){
            localStorage.setItem(
                "imageUrl",
                JSON.stringify(json)
              );
              router.push('/dashboard');
        }else if (json.success === false){
            if (json.code === 2 || json.code === "2") {
              LogOutMethod(navigate);
            }
          }
     })
    }


    return (
//         <Stack
//             sx={{
//                 minHeight: '100vh',
//                 display: 'flex',
//                 justifyContent: 'center', 
//                 alignItems: 'center', 
//             }}
//         >
//             <Stack
//                 sx={{
//                     width: '40%',
//                     height: '40%',
//                     boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
//                     background: 'white',
//                     padding: '30px',
//                     borderRadius: '7px',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                 }}
//                 spacing={4}
//             >
//    <Typography align="center" sx={{ fontSize: '25px', mb: '10px', fontWeight: 'bold' }}>
//           Sign In
//         </Typography>
//         <Stack spacing={4}
//  width="100%" alignItems="center" justifyContent="center">
//         <TextField
//             label="Email"
//             id="movie-title"
//             value={email}
//             type='email'
//             onChange={(e) => setEmail(e.target.value)}
//             size="small"
//             // error={!!errors.email}
//             helperText={errors.email}
//             sx={{ width: '100%' }}
//           />
//            <TextField
//             label="Password"
//             id="password"
//             value={password}
//             type={showPassword ? "text" : "password"}
//             onChange={(e) => setPassword(e.target.value)}
//             size="small"
//             // error={!!errors.password}
//             helperText={errors.password}
//             sx={{ width: '100%' }}
//             InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                       <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//           />
//           <LoadingButton
//   loadingPosition="center"
//   variant="contained"
//   loading={loading}
//   onClick={()=>handleSubmit()}

// >
//   Submit
// </LoadingButton>
             
//         </Stack>
//             </Stack>
//         </Stack>

<Stack
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6f8', 
      }}
    >
    <Stack className="log-site">
      <div className="log" style={{  margin: 30}}>
       <img src="/assets/images/img/chit1.png" alt="Loading"  />
        </div>
      </Stack>
      <Stack
        sx={{
          width: { xs: '90%', md: '440px' },
          height: 'auto',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        spacing={3}
      >
        <Typography
          align="left"
          sx={{ fontSize: '28px',  fontWeight: 'bold', color: '#333' }}
        >
Login        </Typography>
        <Stack spacing={3} width="100%" alignItems="center" justifyContent="center">
          <TextField
            label="Email"
            id="email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            // error={!!errors.email}
            helperText={errors.email}
            sx={{
                width: '100%',
                '& .MuiFormHelperText-root': {
                  color: errors.email ? 'red' : 'inherit',
                },
              }}
          />
          <TextField
            label="Password"
            id="password"
            value={password}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            // error={!!errors.password}
            helperText={errors.password}
            sx={{
                width: '100%',
                '& .MuiFormHelperText-root': {
                  color: errors.password ? 'red' : 'inherit',
                },
              }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            fullWidth
            loadingPosition="center"
            variant="contained"
            loading={loading}
            onClick={handleSubmit}
            sx={{
              
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#1976d2', 
              '&:hover': {
                backgroundColor: '#115293', 
              },
            }}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Stack>
    </Stack>
    );
}
