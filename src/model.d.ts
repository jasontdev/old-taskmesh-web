export type Tasklist = {
  id: number;
  name: string;
  tasks?: Task[];
  users: User[];
}

export type NewTasklist = {
  name: string;
  tasks: NewTask[];
  users: User[];
}

export type Task = {
  id: number;
  name: string;
  isComplete: boolean;
}

export type NewTask = {
  name: string;
  isComplete: boolean;
}

export type User = {
  id: string;
  tasklists?: Tasklist[];
}