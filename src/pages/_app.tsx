import { AppProps } from 'next/app';
import '../styles/global.scss';

import { AuthProvider } from '../contexts/AuthContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;
