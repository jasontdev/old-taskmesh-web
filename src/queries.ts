import axios from "axios";

export async function getUser(accountId: string, accessToken: string) {
  return axios
    .get(`http://localhost:8080/user/${accountId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
}
