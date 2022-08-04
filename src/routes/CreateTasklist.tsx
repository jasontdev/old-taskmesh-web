import React, { useEffect, useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NewTasklist } from "../model";
import UsersTasklists from "../components/UsersTasklists";

function CreateTasklist() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");
  const [selectedTasklist, setSelectedTasklist] = useState<number>();

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
      .catch((error) => instance.loginPopup());
    // TODO: trigger re-fetch
  }, []);

  return (
    <div>
      <AuthenticatedTemplate>
        {data && data.tasklists ? (
          <div className="grid grid-cols-4 grid-rows-4 h-full">
            <div className="flex flex-col align-middle col-span-1 row-span-4">
              <UsersTasklists
                tasklists={data.tasklists}
                selectedTasklist={selectedTasklist}
                handleTasklistSelection={(tasklist) =>
                  setSelectedTasklist(tasklist)
                }
              />
            </div>
            <div className="col-span-3 row-span-4"></div>
          </div>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate></UnauthenticatedTemplate>
    </div>
  );
}

export default CreateTasklist;
