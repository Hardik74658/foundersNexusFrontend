import React, { useState } from 'react';
import signup from '../assets/signup.jpg';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { useDispatch } from 'react-redux';
import { login as sliceLogin } from '../redux/slices/authSlice';

export const Login = () => {
  // Set up react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Custom Material UI theme with a "brand" color palette
  const theme = createTheme({
    palette: {
      brand: {
        main: '#3182ce;',
      },
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error,setError] = useState('')
  const [loader,setLoader] = useState(false)
  // Handle form submission
  const onSubmit = async (data) => {
    setLoader(true)
    try {
      const res = await login(data);
      console.log(res)
      if (res.status === 200) {
        console.log("inside status 200");
        
        localStorage.setItem('userId', res.data.user._id);
        localStorage.setItem('role', res.data.user.role.name);
        dispatch(sliceLogin(res.data));
        setLoader(false)
        alert('Login successful!');
        navigate("/landing_page");
      }
    } catch (error) {
      console.error("Login error:", error); // Improved error logging
      setError(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex justify-between items-center w-full h-screen">
        <div className="flex gap-8 md:justify-between items-center">
          {/* Use Material UI's Box as the form container */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
            className="flex p-8 justify-evenly"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
          >
            <div className="w-1/3">
              <img className="w-full" src={signup} alt="Signup" />
            </div>
            <div className="w-1/3 flex flex-col gap-8 justify-center items-center">
              {/* Email TextField with validation */}
              <TextField
                id="standard-email"
                label="Email Address"
                placeholder="example@example.com"
                variant="standard"
                color="brand"
                autoComplete="username" // Added autocomplete attribute
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
              />

              {/* Password TextField with validation */}
              <TextField
                color="brand"
                id="standard-password-input"
                label="Password"
                placeholder="Hello@123"
                type="password"
                autoComplete="current-password" // Added autocomplete attribute
                variant="standard"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
              />

              {/* 
              // If you want to include RoleGroupRadio (for role selection) using react-hook-form's Controller,
              // ensure RoleGroupRadio accepts control as a prop and integrates with react-hook-form.
              <RoleGroupRadio control={control} />
              */}

              {/* Submit button */}
              <button
                type="submit"
                className="bg-orange-600 font-semibold text-md cursor-pointer text-white px-4 py-2 rounded-md"
              >
                {(loader)?"Logging In":"Login"}
                
              </button>
            </div>
            {(error)?<div className='text-md text-red-500 '>{error.message}</div>:<></>}
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;
