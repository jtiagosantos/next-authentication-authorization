import { User } from '../../contexts/AuthContext';
import { api } from '../axios/api';

type GetLoggedUserDataResponse = User;

export const getLoggedUserDataService =
  async (): Promise<GetLoggedUserDataResponse> => {
    try {
      const { data } = await api.get('/me');

      return data;
    } catch (error) {
      console.log(error);
    }
  };
