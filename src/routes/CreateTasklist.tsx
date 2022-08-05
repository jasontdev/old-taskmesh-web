import React, { useEffect, useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NewTasklist } from "../model";
import { getUser } from "../queries";

function CreateTasklist() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");

  const { data } = useQuery(["tasklists"], {
    enabled: accessToken !== "",
    queryFn: () => {
      return getUser(accounts[0].localAccountId, accessToken);
    },
  });

  const newTasklistMutation = useMutation((newTasklist: NewTasklist) => {
    return axios
      .post("http://localhost:8080/tasklist", newTasklist, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => response.data);
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
      <AuthenticatedTemplate>
        {data && data.tasklists ? <div></div> : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate></UnauthenticatedTemplate>
    </div>
  );
}

export default CreateTasklist;
