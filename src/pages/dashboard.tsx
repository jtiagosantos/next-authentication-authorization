import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { setupAPIClient } from '../services/axios/api';
import { api } from '../services/axios/apiClient';
import { withSSRAuth } from '../utils/withSSRAuth';

const Dashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    api.get('/me').then((response) => console.log(response));
  }, []);

  return <h1>Dashboard: {user?.email}</h1>;
};

export default Dashboard;

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupAPIClient(context);
  await apiClient.get('/me');

  return {
    props: {},
  };
});
