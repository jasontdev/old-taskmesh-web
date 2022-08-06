import React, { useEffect, useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { NewTask, NewTasklist, Task, Tasklist, User } from "../model";
import { useFieldArray, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

type TasklistForm = {
  name: string;
  tasks: { name: string }[];
};

function CreateTasklist() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");
  const { register, handleSubmit, control } = useForm<TasklistForm>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "tasks",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const newTasklistMutation = useMutation(
    (newTasklist: NewTasklist) => {
      return axios
        .post("http://localhost:8080/tasklist", newTasklist, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => response.data);
    },
    {
      onSuccess: (data) => {
        // The goal here is to assimilate the tasklist with the old user data before
        // navigating to the new tasklist page
        const oldQueryData = queryClient.getQueryData<User>(["tasklists"]);
        if (oldQueryData) {
          if (oldQueryData.tasklists) {
            oldQueryData.tasklists.push(data);
          } else {
            oldQueryData.tasklists = [data];
          }
        }
        // TODO: under what circumstances might there be no query data already?
        queryClient.setQueryData(["tasklists"], oldQueryData);
        navigate(`/tasklist/${data.id}`);
      },
    }
  );

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
    <div className="p-8 flex">
      <AuthenticatedTemplate>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((data) => {
            let newTasklist: NewTasklist = {
              name: data.name,
              tasks: data.tasks.map((task) => ({
                name: task.name,
                isComplete: false,
              })),
              users: [{ id: accounts[0].localAccountId }],
            };
            newTasklistMutation.mutate(newTasklist);
          })}
        >
          <input
            {...register("name")}
            className="text-3xl font-bold"
            placeholder="Title"
          ></input>
          {fields.map((field, index) => (
            <input
              key={field.id}
              {...register(`tasks.${index}.name`)}
              placeholder="Task name"
            />
          ))}
          <button
            type="button"
            className="py-1 px-4 bg-blue-400 text-white mx-auto"
            onClick={() => append({ name: "" })}
          >
            Add task
          </button>
          <button
            type="submit"
            className="py-1 px-4 bg-blue-400 text-white mx-auto"
          >
            Save
          </button>
        </form>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate></UnauthenticatedTemplate>
    </div>
  );
}

export default CreateTasklist;
