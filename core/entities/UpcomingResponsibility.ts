export type UpcomingResponsibilityCategory =
  | "problem sets"
  | "learning sections"
  | "workouts"
  | "chapters"
  | "upcoming responsibilities";

export interface UpcomingResponsibilityProps {
  _id?: string;
  ur_id: string;
  user_id: string;
  name: string;
  to: Date;
  completed?: string;
  mtg_id?: string;
  category: UpcomingResponsibilityCategory;
}

export class UpcomingResponsibility {
  public readonly _id?: string;
  public readonly ur_id: string;
  public readonly user_id: string;
  public name: string;
  public to: Date;
  public completed: string;
  public mtg_id?: string;
  public category: UpcomingResponsibilityCategory;

  constructor(props: UpcomingResponsibilityProps) {
    if (!props.ur_id) {
      throw new Error("ur_id is required");
    }

    if (!props.user_id) {
      throw new Error("user_id is required");
    }

    if (!props.name.trim()) {
      throw new Error("name is required");
    }


    this._id = props._id;
    this.ur_id = props.ur_id;
    this.user_id = props.user_id;
    this.name = props.name;
    this.to = props.to;
    this.completed = props.completed ?? "Not Started";
    this.mtg_id = props.mtg_id;
    this.category = props.category;
  }

  markCompleted() {
    this.completed = "Completed";
  }

  markPending() {
    this.completed = "Not Started";
  }
}
