import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCan } from '../hooks/useCan';
import { setupAPIClient } from '../services/axios/api';
import { api } from '../services/axios/apiClient';
import { withSSRAuth } from '../utils/withSSRAuth';

const Dashboard = () => {
  const { user } = useAuth();

  const userCanSeeMetrics = useCan({
    permissions: ['metrics.list'],
  });

  useEffect(() => {
    api.get('/me').then((response) => console.log(response));
  }, []);

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>
      {userCanSeeMetrics && <div>Métricas</div>}
    </>
  );
};

export default Dashboard;

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupAPIClient(context);
  await apiClient.get('/me');

  return {
    props: {},
  };
});
