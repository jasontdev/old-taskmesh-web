import { useState } from "react";
import { Tasklist } from "../../model";
import Heading2 from "../atoms/Headings/Heading2";
import TaskList from "../molecules/TaskList";
import TasklistView from "../molecules/TasklistView";
import { useNavigate } from "react-router-dom";

type UsersTasklistsProps = {
  tasklists: Tasklist[];
};

export default function UsersTasklists({ tasklists }: UsersTasklistsProps) {
  const [selectedTask, setSelectedTask] = useState<number>();
  const navigate = useNavigate();
  console.log(tasklists);
  return (
    <>
      <div className="flex flex-col align-middle col-span-1 row-span-4">
        <div className="py-8">
          <Heading2 text="Tasklists" />
          {tasklists.length > 0 && (
            <TaskList
              tasklists={tasklists}
              onTaskSelected={(key: number) => {
                setSelectedTask(key);
              }}
            />
          )}
        </div>
        <button
          className="rounded-2xl hover:bg-blue-400 bg-blue-500 py-1 px-8 font-bold text-white mx-auto"
          onClick={() => navigate("/create-tasklist")}
        >
          Add
        </button>
      </div>
      <div className="col-span-3 row-span-4">
        {selectedTask && (
          <TasklistView
            tasklist={
              tasklists.filter(
                (tasklist: Tasklist) => tasklist.id === selectedTask
              )[0]
            }
          />
        )}
      </div>
    </>
  );
}
