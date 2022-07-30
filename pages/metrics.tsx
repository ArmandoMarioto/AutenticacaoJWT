
import { setupAPIClient } from "../service/api";
import { withSSRAuth } from "../utils/withSSRAuth";



export default function Dashboard() {

    return(
      <>
        <h1>Metrics:</h1>
      </>
    )
}



export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient =  setupAPIClient(ctx);
    await apiClient.get('/me');

    return {
      props: {},
    };
  },{
    permissions: ['metrics.list'],
    roles: ['administrator']
  });