import React , { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import FormProvider from '../../components/hook-form/FormProvider'
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, IconButton, InputAdornment, Link, Stack } from '@mui/material';
import { RHFTextField } from '../../components/hook-form';
import { Eye, EyeSlash } from 'phosphor-react';
import { Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../../redux/slices/authSlice';
import { dispatch } from '../../redux/store';


const LoginForm = () => {

  const [showPassword, setShowPassword] = useState(false);

  //validation rules 
  const loginSchema = Yup.object().shape({
    username:Yup.string().required('Username is required'),
    password:Yup.string().required('Password is required')
  });

  const methods = useForm({
    resolver: yupResolver(loginSchema)
  });

  const {reset, setError, handleSubmit, formState:{errors, isSubmitting, isSubmitSuccessful}}
   = methods;

   const onSubmit = async (data) => {
    try {
        const response = await fetch('http://localhost:8080/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
           
        });

        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }

        const { token } = await response.json();

        // Store token in session storage
        sessionStorage.setItem('token', token);

        // Fetch user details
        const userResponse = await fetch(`http://localhost:8080/v1/user/getUserDetailsByUsername/${data.username}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user details.');
        }

        const userData = await userResponse.json();

        // Dispatch to Redux store
        dispatch(loginUser(userData));

    } catch (error) {
        console.error(error);
        reset();
        setError('afterSubmit', {
            type: 'server',
            message: error.message,
        });
    }
};

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
            {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
        
        <RHFTextField name='username' label='Username'/>
        <RHFTextField name='password' label='Password' type={showPassword ? 'text' : 'password'}
        InputProps={{endAdornment:(
            <InputAdornment>
            <IconButton onClick={()=>{
                setShowPassword(!showPassword);
            }}>
                {showPassword ? <Eye/>: <EyeSlash/>}
            </IconButton>
            </InputAdornment>
        )}}/>
        </Stack>
        <Stack alignItems={'flex-end'} sx={{my:2}}>
            {/* <Link component={RouterLink} to='/auth/reset-password'
             variant='body2' color='inherit' underline='always'>Forgot Password?</Link> */}
        </Stack>
        <Button fullWidth color='inherit' size='large' type='submit' variant='contained'
        sx={{bgcolor:'text.primary', color:(theme)=> theme.palette.mode === 'light' ?
         'common.white':'grey.800',
         '&:hover':{
            bgcolor:'text.primary',
            color:(theme)=> theme.palette.mode === 'light' ? 'common.white':'grey.800',
         }}}>Login</Button>
    </FormProvider>
  )
}

export default LoginForm