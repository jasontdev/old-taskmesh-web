import React from "react";
import { Tasklist } from "../model";

type TasklistViewProps = {
  tasklist: Tasklist;
};

export default function TasklistView({ tasklist }: TasklistViewProps) {
  return (
    <div className="p-8 h-full">
      <h1 className="font-bold text-3xl text-slate-900">{tasklist.name}</h1>
      <div className="mt-8 flex flex-col gap-1 text-xl h-full">
        {tasklist.tasks
          ? tasklist.tasks.map((task) => <div className="bg-white py-1 px-4">{task.name}</div>)
          : null}
      </div>
    </div>
  );
}
