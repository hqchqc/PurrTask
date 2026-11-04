export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  finishedAt: number | null;
  deletedAt: number | null;
  updatedAt: number;
}
