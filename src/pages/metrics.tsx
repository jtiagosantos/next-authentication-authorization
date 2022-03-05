import { setupAPIClient } from '../services/axios/api';
import { withSSRAuth } from '../utils/withSSRAuth';

const Metrics = () => <h1>Metrics</h1>;

export default Metrics;

export const getServerSideProps = withSSRAuth(
  async (context) => {
    const apiClient = setupAPIClient(context);
    await apiClient.get('/me');

    return {
      props: {},
    };
  },
  {
    permissions: ['metrics.list'],
    roles: ['administrator', 'editor'],
  },
);
