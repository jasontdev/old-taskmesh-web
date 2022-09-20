import axios, { AxiosResponse } from "axios";
import { GetUserResponse, User } from "./model";

export async function getUser(accountId: string, accessToken: string): Promise<User> {
  return axios
    .get<User>(`http://localhost:8080/user/${accountId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
}
