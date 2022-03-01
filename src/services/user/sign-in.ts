import { SignInCredentials } from '../../contexts/AuthContext';
import { api } from '../axios/api';

type SignInUserRequest = SignInCredentials;

export const signInUserService = async ({
  email,
  password,
}: SignInUserRequest) => {
  try {
    await api.post('sessions', {
      email,
      password,
    });
  } catch (error) {
    console.log(error);
  }
};
