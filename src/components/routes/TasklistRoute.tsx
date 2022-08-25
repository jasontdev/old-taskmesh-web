import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import { Tasklist } from "../../model";
import TasklistView from "../views/tasklist/TasklistView";
import { getUser } from "../../queries";

function TasklistRoute() {
  const { id } = useParams();
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");

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
      .catch((error) => instance.loginPopup());
    // TODO: trigger re-fetch
  }, []);

  return (
    <div>
      <AuthenticatedTemplate>
        {id && data && data.tasklists ? (
          <div>
            <TasklistView
              tasklist={
                data.tasklists.filter(
                  (tasklist: Tasklist) => tasklist.id === parseInt(id)
                )[0]
              }
            />
          </div>
        ) : null}
      </AuthenticatedTemplate>
    </div>
  );
}

export default TasklistRoute;
