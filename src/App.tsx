import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UsersTasklists from "./components/pages/UsersTasklists";

function App() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");

  const { data } = useQuery(["tasklists"], {
    enabled: accessToken !== "",
    queryFn: async () => {
      return axios
        .get(`http://localhost:8080/user/${accounts[0].localAccountId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => response.data);
    },
  });

  useEffect(() => {
    instance
      .acquireTokenSilent({
        scopes: ["api://4f960b5c-b3c5-44fb-89bc-f13cae3b20b1/User"],
        account: accounts[0],
      })
      .then((response) => setAccessToken(response.accessToken))
      .catch((error) => instance.loginPopup());
    // TODO: trigger re-fetch
  }, []);

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-full">
      <AuthenticatedTemplate>
        {data && data.tasklists && (
          <UsersTasklists tasklists={data.tasklists} />
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <h1>Welcome to Taskmesh</h1>
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;
