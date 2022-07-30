
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../service/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const userCanSeeMetrics = useCan({
    roles: ["administrator"],
  })

    const { user } = useContext(AuthContext);
    return(
      <>
        <h1>Dashboard: {user?.email}</h1>
        { userCanSeeMetrics && <div>Métricas</div>}
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