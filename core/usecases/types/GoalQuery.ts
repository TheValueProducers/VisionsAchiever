export interface GoalQuery {
  user_id: string;
  goal_type: string | null;
  goal_category: string | null;
  start_date: Date | null;
  end_date: Date | null;
  goal_id?: string | null;
  ltg_id?: string | null;
  mtg_id?: string | null;
  ur_id?: string | null;
}

export interface GoalItem {
  id?: string;
  _id?: string;
  user_id: string;
  goal_type: string;
  name?: string;
  goal_category: string;
  from: Date;
  to: Date;
  completed: "Not Started" | "In Progress" | "Completed";
  ltg_id?: string | null;
  mtg_id?: string | null;
  ur_id?: string | null;
  task_id?: string | null;
}

export interface GoalCreateInput {
  user_id: string;
  goal_type: string;
  name: string;
  from: Date;
  to: Date;
  completed?: "Not Started" | "In Progress" | "Completed";
  goal_category?: string | null;
  task_id?: string;
  ur_id?: string;
  mtg_id?: string;
  ltg_id?: string;
}

export interface GoalUpdateInput {
  goal_id: string;
  goal_type: string;
  field: string;
  value: string | number | Date | null;
}
