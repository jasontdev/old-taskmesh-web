import React from "react";
import { Tasklist } from "../../model";
import { Box, Button, Checkbox, Flex, Heading, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";

type TasklistViewProps = {
  tasklist: Tasklist;
};

export default function TasklistView({ tasklist }: TasklistViewProps) {
  const navigate = useNavigate();
  return (
    <div>
      <Heading as="h1" size="2xl">
        {tasklist.name}
      </Heading>
      <Stack py="1rem">
        {tasklist.tasks &&
          tasklist.tasks.map((task) => (
            <Box borderWidth="0.1rem" borderStyle="solid" borderColor="royalblue" key={task.id} borderRadius="md" py="0.2rem" px="0.5rem">
              <Checkbox
                size="lg"
                onChange={(e) => console.log(e.target.checked)}
              >
                {task.name}
              </Checkbox>
            </Box>
          ))}
      </Stack>
      <Button colorScheme="blue" leftIcon={<AddIcon />}>
        Task
      </Button>
    </div>
  );
}
