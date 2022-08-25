import { useEffect, useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { NewTasklist, User } from "../../model";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Flex, IconButton, Input, Stack } from "@chakra-ui/react";
import { AddIcon, CloseIcon, WarningTwoIcon } from "@chakra-ui/icons";

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
    <div>
      <AuthenticatedTemplate>
        <form
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
          <Stack gap="1rem">
            <Input
              {...register("name")}
              placeholder="Title"
              fontSize="4xl"
              fontWeight="bold"
            ></Input>
            <Stack>
              {fields.map((field, index) => (
                <Flex gap="1rem" key={field.id}>
                  <Input
                    {...register(`tasks.${index}.name`)}
                    placeholder="Task name"
                  />
                  <IconButton
                    icon={<CloseIcon />}
                    aria-label="Remove field"
                    onClick={() => remove(index)}
                  ></IconButton>
                </Flex>
              ))}
            </Stack>
            <Flex gap="1rem">
              <Button
                type="button"
                colorScheme="green"
                leftIcon={<AddIcon />}
                onClick={() => append({ name: "" })}
              >
                Task
              </Button>
              <Button type="submit" colorScheme="blue">
                Save
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<WarningTwoIcon />}
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </Flex>
          </Stack>
        </form>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate></UnauthenticatedTemplate>
    </div>
  );
}

export default CreateTasklist;
