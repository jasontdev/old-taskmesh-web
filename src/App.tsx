import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NewTasklist, Tasklist } from "./model";
import TasklistView from "./components/TasklistView";
import axios from "axios";
import UsersTasklists from "./components/UsersTasklists";
import { useNavigate } from "react-router-dom";

function App() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");
  const [selectedTasklist, setSelectedTasklist] = useState<number>();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (data && data.tasklists) {
      if (data.tasklists.length > 0) {
        setSelectedTasklist(data.tasklists[0].id);
      }
    }
  }, [data]);

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-full">
      <AuthenticatedTemplate>
        {data && data.tasklists ? (
          <div className="flex flex-col align-middle col-span-1 row-span-4">
            <UsersTasklists
              tasklists={data.tasklists}
              selectedTasklist={selectedTasklist}
              handleTasklistSelection={(tasklist) =>
                setSelectedTasklist(tasklist)
              }
            />
            <button
              className="rounded-2xl hover:bg-blue-400 bg-blue-500 py-1 px-8 font-bold text-white mx-auto"
              onClick={() => navigate("/create-tasklist")}
            >
              Add
            </button>
          </div>
        ) : null}
        <div className="col-span-3 row-span-4">
          {selectedTasklist ? (
            <TasklistView
              tasklist={
                data.tasklists.filter(
                  (tasklist: Tasklist) => tasklist.id === selectedTasklist
                )[0]
              }
            />
          ) : null}
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <h1>Welcome to Taskmesh</h1>
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;
