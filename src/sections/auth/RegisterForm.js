import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider from '../../components/hook-form/FormProvider';
import { Alert, Button, IconButton, InputAdornment, Stack, Snackbar } from '@mui/material';
import { RHFTextField } from '../../components/hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeSlash } from 'phosphor-react';
import axios from 'axios';

const RegisterForm = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const navigate = useNavigate();


  //validation rules 
  const registerSchema = Yup.object().shape({
    userName: Yup.string().required('User Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required')
  });

  

  const methods = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues : {}
  });

  const { reset, setError, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } }
    = methods;


    const onSubmit = async (data) => {
      try {
          const response = await axios.post('http://localhost:8080/v1/auth/register', {
              username: data.userName,
              password: data.password,
              email: data.email
          });

          console.log('Registration Successful:', response.data);

          // Show success alert
          setAlert({ open: true, message: 'Registration Successful! Redirecting...', severity: 'success' });

          // Redirect to login after 2 seconds
          setTimeout(() => {
              setAlert({ open: false, message: '', severity: '' });
              navigate('/auth/login');
          }, 2000);

      } catch (error) {
          console.error('Registration Error:', error);

          // Extract error messages from response
          const errorData = error.response?.data || {};

          // Display field-specific errors
          Object.keys(errorData).forEach((key) => {
              setError(key, {
                  type: 'server',
                  message: errorData[key]
              });
          });

          // Show general error alert
          setAlert({
              open: true,
              message: errorData.message || errorData.error  || 'Registration failed. Please check your input and try again.',
              severity: 'error'
          });
      }
  };

  return (
    <>
    <Snackbar
                open={alert.open}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={4000}
                onClose={() => setAlert({ ...alert, open: false })}
            >
                <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
                    {alert.message}
                </Alert>
            </Snackbar>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}

          <RHFTextField name="userName" label='User Name' />
          <RHFTextField name='email' label='Email address' />
          <RHFTextField name='password' label='Password' type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton onClick={() => {
                    setShowPassword(!showPassword);
                  }}>
                    {showPassword ? <Eye /> : <EyeSlash />}
                  </IconButton>
                </InputAdornment>
              )
            }} />
          <Button fullWidth color='inherit' size='large' type='submit' variant='contained'  disabled={isSubmitting || alert.open}
            sx={{
              bgcolor: 'text.primary', color: (theme) => theme.palette.mode === 'light' ?
                'common.white' : 'grey.800',
              '&:hover': {
                bgcolor: 'text.primary',
                color: (theme) => theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
              }
            }}>Create Account</Button>
        </Stack>

      </FormProvider>
     
    </>
  )
}

export default RegisterForm