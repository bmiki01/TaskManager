export interface User {
  id: number;
  username: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: string;
}
