import axios from "axios";

const API_URL = 'https://reqres.in/api';

export const login = async (email,password)=>{
  try {
    const response = await axios.post(`${API_URL}/login`, {email,password});
    console.log("token received after login"+ response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data ||{error:'Something went wrong'};
  }
};