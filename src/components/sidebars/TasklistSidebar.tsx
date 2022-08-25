import { useState } from "react";
import { Tasklist } from "../../model";
import Heading2 from "../atoms/Headings/Heading2";
import TaskList from "../molecules/Tasklists";
import TasklistView from "../views/TasklistView";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

type UsersTasklistsProps = {
  tasklists: Tasklist[];
};

export default function TasklistSidebar({ tasklists }: UsersTasklistsProps) {
  const [selectedTask, setSelectedTask] = useState<number>();
  const navigate = useNavigate();
  console.log(tasklists);
  return (
    <>
      <Flex flexDirection="column" gap="1rem">
        <Heading as="h1" size="lg">
          Tasklists
        </Heading>
        {tasklists.length > 0 && (
          <TaskList
            tasklists={tasklists}
            onTaskSelected={(key: number) => {
              setSelectedTask(key);
            }}
          />
        )}
        <Flex justifyContent="center">
          <Button
            colorScheme="blue"
            leftIcon={<AddIcon />}
            onClick={() => navigate("/create-tasklist")}
            aria-label={"Add tasklist"}
          >
            Tasklist
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
