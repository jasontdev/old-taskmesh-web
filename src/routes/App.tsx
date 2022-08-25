import React, { useEffect, useState } from "react";
import Navbar from "../components/molecules/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import TasklistSidebar from "../components/pages/TasklistSidebar";
import { getUser } from "../queries";
import {Box, Button, Grid, SimpleGrid} from "@chakra-ui/react";

export default function App() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  const { data } = useQuery(["tasklists"], {
    enabled: accessToken !== "",
    queryFn: () => {
      return getUser(accounts[0].localAccountId, accessToken);
    },
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
            <TasklistSidebar tasklists={data.tasklists} />
          ) : null}
        </Box>
        <Box >
          <Outlet />
        </Box>
      </SimpleGrid>
    </div>
  );
}
