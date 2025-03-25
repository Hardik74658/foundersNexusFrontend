import axios from "axios" 

export const login =  async (loginCredentials) =>  {
    try {
        const res = await axios.post("/user/login/",loginCredentials)
        if(res.status==200){
            return res
        }
    } catch (error) {
        console.log("Error Occures During Login Service : ",error);
    }
}

export const getCurrentUser = async () =>{

    const userId = localStorage.getItem("userId")
    if(userId){
        try {
            const userData = await axios.get(`/users/${userId}`)
            return userData;
        } catch (error) {
            console.log("Get Current User Service Error: ",error);
        }
    }
    return null
}


   
