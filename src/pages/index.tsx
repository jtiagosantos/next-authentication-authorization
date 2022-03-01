import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/Home.module.scss';

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
      />
      <input
        type="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Home;
