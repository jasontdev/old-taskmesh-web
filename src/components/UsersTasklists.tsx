import React, { useState } from "react";
import { Tasklist } from "../model";
import { useNavigate } from "react-router-dom";

type UsersTasklistsProps = {
  tasklists: Tasklist[];
};

export default function UsersTasklists({ tasklists }: UsersTasklistsProps) {
  const navigate = useNavigate();
  const [selectedTasklist, setSelectedTasklist] = useState<number>();

  function selectTasklist(tasklist: number) {
    setSelectedTasklist(tasklist);
    navigate(`/tasklist/${tasklist}`);
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold px-8 pb-4">Tasklists</h2>
      {tasklists.length > 0 ? (
        <ul>
          {tasklists.map((list) =>
            list.id === selectedTasklist ? (
              <li
                className="text-lg bg-gray-400 text-white px-8"
                onClick={() => selectTasklist(list.id)}
                key={list.id}
              >
                {list.name}
              </li>
            ) : (
              <li
                key={list.id}
                className="text-lg px-8"
                onClick={() => selectTasklist(list.id)}
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
