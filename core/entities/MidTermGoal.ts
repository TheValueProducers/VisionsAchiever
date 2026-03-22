export type MidTermGoalCategory =
  | "classes"
  | "courses"
  | "work out goals"
  | "books"
  | "mid term goals";

export interface MidTermGoalProps {
  _id?: string;
  mtg_id: string;
  user_id: string;
  name: string;
  to: Date;
  completed?: string;
  ltg_id?: string;
  category: MidTermGoalCategory;
}

export class MidTermGoal {
  public readonly _id?: string;
  public readonly mtg_id: string;
  public readonly user_id: string;
  public name: string;
  public to: Date;
  public completed: string;
  public ltg_id?: string;
  public category: MidTermGoalCategory;

  constructor(props: MidTermGoalProps) {
    if (!props.mtg_id) {
      throw new Error("mtg_id is required");
    }

    if (!props.user_id) {
      throw new Error("user_id is required");
    }

    if (!props.name.trim()) {
      throw new Error("name is required");
    }

   

    this._id = props._id;
    this.mtg_id = props.mtg_id;
    this.user_id = props.user_id;
    this.name = props.name;
   
    this.to = props.to;
    this.completed = props.completed ?? "Not Started";
    this.ltg_id = props.ltg_id;
    this.category = props.category;
  }

  markCompleted() {
    this.completed = "Completed";
  }

  markPending() {
    this.completed = "Not Started";
  }
}
