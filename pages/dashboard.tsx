
import { useContext } from "react";
import { Can } from "../components/Can";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPIClient } from "../service/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {


    const { user, signOut } = useContext(AuthContext);
    return(
      <>
        <h1>Dashboard: {user?.email}</h1>
        <button onClick={signOut}>SignOut</button>
        <Can permissions={['metrics.list']}>
          <div>Métricas</div>
        </Can>
        
      </>
    )
}



export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient =  setupAPIClient(ctx);
    await apiClient.get('/me');
    return {
      props: {},
    };
  });