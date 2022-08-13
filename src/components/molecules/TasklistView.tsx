import React from "react";
import { Tasklist } from "../../model";
import Heading1 from "../atoms/Headings/Heading1";

type TasklistViewProps = {
  tasklist: Tasklist;
};

export default function TasklistView({ tasklist }: TasklistViewProps) {
  return (
    <div className="p-8 col-span-3 row-span-3">
      <Heading1 text={tasklist.name} />
      {tasklist.tasks && tasklist.tasks.map((task) => <p>{task.name}</p>)}
    </div>
  );
}
