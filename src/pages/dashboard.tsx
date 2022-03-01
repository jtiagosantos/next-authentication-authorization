import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/axios/api';

const Dashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    api.get('/me').then((response) => console.log(response));
  }, []);

  return <h1>Dashboard: {user?.email}</h1>;
};

export default Dashboard;
