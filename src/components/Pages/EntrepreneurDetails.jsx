import React from 'react';
import signup from '../assets/signup.jpg';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RoleGroupRadio from './RoleGroupForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const EntrepreneurDetails = () => {
  const {
     handleSubmit,
     control,
     watch,
     formState: { errors },
   } = useForm();
 
   const navigate = useNavigate();
 
   const password = watch('password', '');
 
   const onSubmit = async (data) => {
     const {confPassword, ...cleanedData} = data;
     console.log('Signup data:', cleanedData);
     const [role,roleId] = cleanedData.roleId.split('/');
     cleanedData.roleId=roleId;
     const res = await axios.post('/users',cleanedData);
     console.log(res)
     if (res.status === 201) {
       alert("Signup success");
       navigate(`/user/${role}`) // check in app.j slogin...
     } else {
       alert("Signup failed");
     }
   };
 
   const theme = createTheme({
     palette: {
       brand: {
         main: '#3182ff',
       },
     },
   });
 
 
   return (
     <ThemeProvider theme={theme}>
       <div className="md:px-16 py-8 h-fit">
         <div className="flex flex-col justify-center items-center md:text-xl text-blue-600">
           <h1>Just Few More information & You're In!!</h1>
         </div>
         
           
         <Box
           component="form"
           onSubmit={handleSubmit(onSubmit)}
           noValidate
           autoComplete="off"
           className="flex flex-col md:flex-row justify-between items-center p-8"
           sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
         >
           {/* Third Column */}
           <div className="w-2/3 flex justify-center items-center">
             <img className="w-full" src={signup} alt="Signup" />
           </div>
           <div className='flex flex-col  justify-between items-center w-full'>
             <div className='flex flex-col md:flex-row justify-between items-center '>
               {/* First Column */}
               <div className="w-1/3 flex flex-col justify-between items-center">
                 <Controller
                   name="fullName"
                   control={control}
                   defaultValue=""
                   rules={{ required: 'Full Name is required' }}
                   render={({ field }) => (
                     <TextField
                     {...field}
                     id="fullName"
                     label="Full Name"
                       placeholder="John Doe"
                       variant="standard"
                       color="brand"
                       error={!!errors.fullName}
                       helperText={errors.fullName ? errors.fullName.message : ''}
                     />
                   )}
                 />
                 <Controller
                   name="email"
                   control={control}
                   defaultValue=""
                   rules={{
                     required: 'Email is required',
                     pattern: {
                       value: /^\S+@\S+\.\S+$/,
                       message: 'Invalid email address',
                     },
                   }}
                   render={({ field }) => (
                     <TextField
                       {...field}
                       id="email"
                       label="Email Address"
                       placeholder="example@example.com"
                       variant="standard"
                       color="brand"
                       error={!!errors.email}
                       helperText={errors.email ? errors.email.message : ''}
                       autoComplete="username"
                     />
                   )}
                 />
                 <Controller
                   name="password"
                   control={control}
                   defaultValue=""
                   rules={{
                     required: 'Password is required',
                     minLength: {
                       value: 6,
                       message: 'Password must be at least 6 characters',
                     },
                   }}
                   render={({ field }) => (
                     <TextField
                       {...field}
                       id="password"
                       label="Password"
                       placeholder="Hello@123"
                       type="password"
                       autoComplete="current-password"
                       variant="standard"
                       color="brand"
                       error={!!errors.password}
                       helperText={errors.password ? errors.password.message : ''}
                     />
                   )}
                 />
                 <Controller
                   name="confPassword"
                   control={control}
                   defaultValue=""
                   rules={{
                     required: 'Confirm Password is required',
                     validate: (value) =>
                       value === password || 'Passwords do not match',
                   }}
                   render={({ field }) => (
                     <TextField
                       {...field}
                       id="confPassword"
                       label="Confirm Password"
                       placeholder="Hello@123"
                       type="password"
                       autoComplete="current-password"
                       variant="standard"
                       color="brand"
                       error={!!errors.confPassword}
                       helperText={
                         errors.confPassword ? errors.confPassword.message : ''
                       }
                     />
                   )}
                 />
               </div>
 
               {/* Second Column */}
               <div className="w-1/3 flex flex-col justify-between items-center">
                 {/* <Controller
                   name="roleId"
                   control={control}
                   defaultValue=""
                   rules={{ required: 'Role is required' }}
                   render={({ field }) => <RoleGroupRadio {...field} />}
                 /> */}
                 <Controller
                   name="bio"
                   control={control}
                   defaultValue=""
                   render={({ field }) => (
                     <TextField
                       {...field}
                       id="bio"
                       label="Bio"
                       multiline
                       rows={5}
                       placeholder="Enter Some Basic Info About Yourself"
                       variant="standard"
                       color="brand"
                     />
                   )}
                 />
                 <Controller
                   name="location"
                   control={control}
                   defaultValue=""
                   render={({ field }) => (
                     <TextField
                       {...field}
                       id="location"
                       label="Location"
                       placeholder="Ahmedabad"
                       variant="standard"
                       color="brand"
                     />
                   )}
                 />
               
               </div>
             </div>
             <div className='w-full flex justify-center items-center flex-col'>
                 <Controller
                   name="roleId"
                   control={control}
                   defaultValue=""
                   rules={{ required: "Role is required" }}
                   render={({ field, fieldState: { error } }) => (
                     <RoleGroupRadio {...field} error={error?.message} />
                   )}
                 />
                 {/* Submit Button */}
                 <div className="w-full flex justify-center mt-4">
                   <button
                     type="submit"
                     className="bg-blue-600 font-semibold text-md cursor-pointer text-white px-4 py-2 rounded-md"
                   >
                     Signup
                   </button>
                 </div>
             </div>
           </div>
         </Box>
       </div>
     </ThemeProvider>
   );
}
