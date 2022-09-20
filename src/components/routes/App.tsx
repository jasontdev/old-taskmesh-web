import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import TasklistsSidebar from "../sidebars/tasklists/TasklistsSidebar";
import { getUser } from "../../queries";
import { Box, SimpleGrid } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { User } from "../../model";

export default function App() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  const { data } = useQuery<Promise<User>, AxiosError>(["tasklists"], {
    enabled: accessToken !== "",
    queryFn: (): Promise<User> => {
      return getUser(accounts[0].localAccountId, accessToken);
    },
    onError: (error) => {
      if(axios.isAxiosError(error)) {
        if(error.response && error.response.status === 404) {
          // user not found. navigate to welcome/onboarding component
          navigate("/welcome");
        }
      }
    }
  });

  useEffect(() => {
    instance
      .acquireTokenSilent({
        scopes: ["api://4f960b5c-b3c5-44fb-89bc-f13cae3b20b1/User"],
        account: accounts[0],
      })
      .then((response) => setAccessToken(response.accessToken))
      .catch(() => instance.loginPopup());
    // TODO: trigger re-fetch
  }, []);

  return (
    <div>
      <Navbar />
      <SimpleGrid columns={5} gap="1rem" mt="1rem">
        <Box px="1rem">
          {data && data.tasklists ? (
            <TasklistsSidebar tasklists={data.tasklists} />
          ) : null}
        </Box>
        <Box>
          <Outlet />
        </Box>
      </SimpleGrid>
    </div>
  );
}
