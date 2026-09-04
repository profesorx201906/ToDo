export class TodoItemDTO {

  constructor(data:Partial<TodoItemDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  title?: string|null;
  description?: string|null;
  priority?: string|null;
  dueDate?: string|null;
  completed?: boolean|null;
  createdAt?: string|null;
  updatedAt?: string|null;
  category?: number|null;

}
