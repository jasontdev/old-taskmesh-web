import React from "react";
import {Tasklist} from "../model";

type UsersTasklistsProps = {
  tasklists: Tasklist[];
  selectedTasklist: number | undefined;
  handleTasklistSelection(tasklist: number): void;
};

export default function UsersTasklists({
  tasklists,
  selectedTasklist,
  handleTasklistSelection,
}: UsersTasklistsProps) {
  console.log(tasklists);
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold px-8 pb-4">Tasklists</h2>
      {tasklists.length > 0 ? (
        <ul>
          {tasklists.map((list) =>
            list.id === selectedTasklist ? (
              <li
                className="bg-gray-400 text-white px-8"
                onClick={() => handleTasklistSelection(list.id)}
                key={list.id}
              >
                {list.name}
              </li>
            ) : (
              <li
                key={list.id}
                className="px-8"
                onClick={() => handleTasklistSelection(list.id)}
              >
                {list.name}
              </li>
            )
          )}
        </ul>
      ) : null}
    </div>
  );
}
