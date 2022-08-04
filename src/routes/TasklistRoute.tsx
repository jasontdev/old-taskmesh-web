import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Tasklist } from "../model";
import UsersTasklists from "../components/UsersTasklists";
import TasklistView from "../components/TasklistView";

function TasklistRoute() {
  const { id } = useParams();
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
    <div>
      <AuthenticatedTemplate>
        {id && data && data.tasklists ? (
          <TasklistView
            tasklist={
              data.tasklists.filter(
                (tasklist: Tasklist) => tasklist.id === parseInt(id)
              )[0]
            }
          />
        ) : null}
      </AuthenticatedTemplate>
    </div>
  );
}

export default TasklistRoute;
