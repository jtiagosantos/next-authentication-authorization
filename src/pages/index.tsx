import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/Home.module.scss';
import { withSSRGuest } from '../utils/withSSRGuest';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const data = { email, password };

    await signIn(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="text"
        value={email}
        onChange={({ target }) => setEmail(target.value)}
        placeholder="E-mail"
      />
      <input
        type="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        placeholder="Senha"
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Home;

export const getServerSideProps = withSSRGuest(async (context) => {
  return {
    props: {},
  };
});
