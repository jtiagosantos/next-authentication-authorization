import { User } from '../../contexts/AuthContext';
import { api } from '../axios/apiClient';

type GetLoggedUserDataResponse = User;

export const getLoggedUserDataService =
  async (): Promise<GetLoggedUserDataResponse> => {
    const { data } = await api.get('/me');

    return data;
  };
