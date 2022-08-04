import React from "react";
import {Tasklist} from "../model";

type TasklistViewProps = {
  tasklist: Tasklist;
}

export default function TasklistView({tasklist}: TasklistViewProps) {
  return (
    <div className="p-8 col-span-3 row-span-3">
      <h1 className="font-bold text-4xl">{tasklist.name}</h1>
      {tasklist.tasks ? tasklist.tasks.map(task => <p>{task.name}</p>) : null}
    </div>
  );
}
