export type DailyTaskCategory =
  | "problems"
  | "learning sub-sections"
  | "exercises"
  | "pages"
  | "tasks";

export interface DailyTaskProps {
  _id?: string;
  task_id: string;
  user_id: string;
  name: string;
  from: Date;
  to: Date;
  completed?: string;
  ur_id?: string;
  category: DailyTaskCategory;
}

export class DailyTask {
  public readonly _id?: string;
  public readonly task_id: string;
  public readonly user_id: string;
  public name: string;
  public from: Date;
  public to: Date;
  public completed: string;
  public ur_id?: string;
  public category: DailyTaskCategory;

  constructor(props: DailyTaskProps) {
    if (!props.task_id) {
      throw new Error("task_id is required");
    }

    if (!props.user_id) {
      throw new Error("user_id is required");
    }

    if (!props.name.trim()) {
      throw new Error("name is required");
    }

    if (props.from > props.to) {
      throw new Error("from date must be before or equal to to date");
    }

    this._id = props._id;
    this.task_id = props.task_id;
    this.user_id = props.user_id;
    this.name = props.name;
    this.from = props.from;
    this.to = props.to;
    this.completed = props.completed ?? "Not Started";
    this.ur_id = props.ur_id;
    this.category = props.category;
  }

  markCompleted() {
    this.completed = "Completed";
  }

  markPending() {
    this.completed = "Not Started";
  }
}
