
export enum Priority {
  High = 1,
  Medium = 2,
  Low = 3,
}

export interface Task {
  id: string;
  taskName: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
  reminderSet?: boolean;
}