import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    fullName:null,
    email:null,
    password:null,
    age:null,
    profilePicture:null,
    bio:null,
    location:null,
    roleId:null,
    followers:null,
    following:null,
    posts:null,
    currentStartup:null,
    isVerified:null,
    isActive:null,
    created_at: null,
    updated_at: null
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        
    }
})