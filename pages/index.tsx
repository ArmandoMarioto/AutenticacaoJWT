import { GetServerSideProps } from "next";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import styles from '../styles/Home.module.css'; 

import { parseCookies } from "nookies";
import { withSSRGuest } from "../utils/withSSRGuest";

export default function Home() {
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');

  const { signIn} = useContext(AuthContext);

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    const data = {
      email,
      password
    }
    await signIn(data);
  }
  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha"/>
      <button type="submit">Enter</button>
    </form>
  );
}


export const getServerSideProps = withSSRGuest(async (ctx) => {

  return {
    props: {},
  };
});