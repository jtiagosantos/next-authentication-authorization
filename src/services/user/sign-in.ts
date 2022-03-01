import { SignInCredentials, User } from '../../contexts/AuthContext';
import { api } from '../axios/api';

type SignInUserRequest = SignInCredentials;

interface SignInUserResponse extends User {
  token: string;
  refreshToken: string;
}

export const signInUserService = async ({
  email,
  password,
}: SignInUserRequest): Promise<SignInUserResponse> => {
  try {
    const { data } = await api.post('sessions', {
      email,
      password,
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};
