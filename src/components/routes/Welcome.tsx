import React, { useEffect, useState } from "react";
import { Button, Heading, Stack } from "@chakra-ui/react";
import axios from "axios";
import { useMsal } from "@azure/msal-react";
import { useMutation } from "@tanstack/react-query";
import { User } from "../../model";

function Welcome() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");

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

  const mutation = useMutation((newUser: User) => {
    return axios
      .post("http://localhost:8080/user", newUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data);
  });
  return (
    <div>
      <Heading as="h1" size="2xl">
        Welcome to Taskmesh
      </Heading>
      <div>
        <Button
          onClick={() => {
            mutation.mutate({ id: accounts[0].localAccountId, tasklists: [] });
          }}
        >
          Create Taskmesh Profile
        </Button>
      </div>
    </div>
  );
}

export default Welcome;