import axios from "axios";

const API_URL = 'https://reqres.in/api';

interface LoginResponse {
  token: string;
}

interface LoginError {
  error: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
    console.log("token received after login" + response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw (error.response?.data as LoginError) || { error: 'Something went wrong' };
    }
    throw { error: 'Something went wrong' };
  }
};
