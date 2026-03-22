export interface LongTermGoalProps {
  _id?: string;
  ltg_id: string;
  user_id: string;
  name: string;
  to: Date;
  completed?: string;
}

export class LongTermGoal {
  public readonly _id?: string;
  public readonly ltg_id: string;
  public readonly user_id: string;
  public name: string;
  public to: Date;
  public completed: string;

  constructor(props: LongTermGoalProps) {
    if (!props.ltg_id) {
      throw new Error("ltg_id is required");
    }

    if (!props.user_id) {
      throw new Error("user_id is required");
    }

    if (!props.name.trim()) {
      throw new Error("name is required");
    }

   

    this._id = props._id;
    this.ltg_id = props.ltg_id;
    this.user_id = props.user_id;
    this.name = props.name;
    this.to = props.to;
    this.completed = props.completed ?? "Not Started";
  }

  markCompleted() {
    this.completed = "Completed";
  }

  markPending() {
    this.completed = "Not Started";
  }
}
