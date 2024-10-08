import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

import { useRouter } from 'src/routes/hooks';

import { GetHeader, PostHeader } from 'src/hooks/AxiosApiFetch';

import { isValidEmail } from 'src/utils/Validator';
import { LogOutMethod } from 'src/utils/format-number';
import { LOGIN_URL, IMAGE_DISPLAY_URL, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import { bgGradient } from 'src/theme/css';
import { pxToRem } from 'src/theme/typography';

// import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import './login-view.css';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [UsernameError, setUsernameError] = useState("");
  const [PasswordError, setPasswordError] = useState("");
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
    };
    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const Params = {
    "username": UserName,
    "password": Password
  }

  const LoginMethod = (IsValidate) => {
    if (IsValidate) {
      setLoading(true);
      const url = `${REACT_APP_HOST_URL}${LOGIN_URL}`;
      // console.log(JSON.stringify(Params) + url);
      fetch(url, PostHeader('', Params))
        .then((response) => response.json())
        .then((json) => {
          // console.log(JSON.stringify(json));
          if (json.success) {
            localStorage.setItem(
              "apiToken",
              JSON.stringify(json.apiToken)
            );
            localStorage.setItem(
              "userDetails",
              JSON.stringify(json.userDetails)
            );
            // router.push('/dashboard');
            GetImageUrl(json.apiToken)
          } else if (json.success === false) {
            setLoading(false);
            if (json.code === 2 || json.code === "2") {
              LogOutMethod(navigate);
            } else {
              const password = "password";
              if (json.message.toLowerCase().includes(password.toLowerCase())) {
                setPasswordError(json.message);
              } else {
                setUsernameError(json.message);
              }
            }
          } else{
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          // console.log(error);
        })
    }
  }

  const GetImageUrl = (Session) => {
    setLoading(true);
    const url = `${REACT_APP_HOST_URL}${IMAGE_DISPLAY_URL}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(Session))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setLoading(false);
        if (json.success) {
          localStorage.setItem(
            "imageUrl",
            JSON.stringify(json)
          );
          router.push('/dashboard');
        } else if (json.success === false){
          if (json.code === 2 || json.code === "2") {
            LogOutMethod(navigate);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        // console.log(error);
      })
  }

  const HandleEmailValue = (e) => {
    const email = e.target.value;
    setUserName(email);
    if (email !== "") {
      if (isValidEmail(email)) {
        setUsernameError("");
      } else {
        setUsernameError("Please enter the valid Email!");
      }
    } else {
      setUsernameError("* Required");
    }
  };

  const validatePassword = (e) => {
    const passwordVal = e.target.value;
    setPassword(passwordVal);
    if (passwordVal !== "") {
      setPasswordError("");
    } else {
      setPasswordError("* Required");
    }
  };

  const ValidateLoginClick = () => {
    let IsValidate = true;
    if (!UserName) {
      IsValidate = false;
      setUsernameError("* Required");
    } else if (!isValidEmail(UserName)) {
      IsValidate = false;
      setUsernameError("Please enter the valid Email!");
    } else {
      setUsernameError("");
    }
    if (!Password) {
      IsValidate = false;
      setPasswordError("* Required");
    } else {
      setPasswordError("");
    }
    LoginMethod(IsValidate);
  }

  document.body.onkeydown = (e) => {
    if (e.key === 'Enter') {
      ValidateLoginClick();
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3} className='login_page'>
        <TextField 
        name="email" 
        label="Email address" 
          value={UserName}
          size='small'
          onChange={(e) => HandleEmailValue(e)}
          sx={{
            '& .MuiInputBase-input':{
            
            }
          }}
        />
        <div style={{ color: '#ce0820', fontSize: pxToRem(12), marginTop: pxToRem(5) }}>{UsernameError}</div>
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={Password}
          size='small'
          onChange={(e) => validatePassword(e)}
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
      </Stack>
      <div style={{ color: '#ce0820', fontSize: pxToRem(12), marginTop: pxToRem(5) }}>{PasswordError}</div>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 , display: 'none'}}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>


      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{
          my: 3, backgroundColor: '#1877f2',
          '&:hover': {
            backgroundColor: 'rgba(24, 119, 242, 0.7)',
          }, }}
        onClick={Loading ? null : ValidateLoginClick} >
        {Loading 
          ? ( <img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, marginRight: '8px' }} />) 
          : ( "Login" )}
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        minHeight: '100vh', // Ensure full viewport height
      
        padding: theme.spacing(1),
      }}
    >
      {/* <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      /> */}
      <Stack className="log-site">
      <div className="log" style={{  marginTop: 20, marginLeft: 20}}>
       <img src="/assets/images/img/chit1.png" alt="Loading"  />
        </div>
      </Stack>

      <Stack alignItems="center" justifyContent="flex-start" sx={{ height: 1 ,m:3}}>
        <Card
        className="card-log"
          sx={{
            px: 5,
            pt: 2,
            pb: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" sx={{ my: 3 }}>Sign in to Chitly</Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
