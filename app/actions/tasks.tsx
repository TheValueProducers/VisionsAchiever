"use server"

import { GoalCreateInput } from "@/core/usecases/types/GoalQuery"
import { createLongTermGoalComposition } from "@/composition/longTermGoalFactory"
import { createMidTermGoalComposition } from "@/composition/midTermGoalFactory"
import { createUpcomingResponsibilityGoalComposition } from "@/composition/upcomingResponsibilityFactory"
import { createDailyTaskGoalComposition } from "@/composition/dailyTaskFactory"
import { auth } from "@/lib/auth"



export interface GoalInputWithoutId {
  goal_type: string;
  name: string;
  from?: Date;
  to: Date;
  completed?: "Not Started" | "In Progress" | "Completed";
  goal_category?: string | null;
  task_id?: string;
  ur_id?: string;
  mtg_id?: string;
  ltg_id?: string;
}

// export interface GoalQuery {
//   user_id: string;
//   goal_type: string | null;
//   goal_category: string | null;
//   start_date: Date | null;
//   end_date: Date | null;
// }

export const handleGetGoals = async (goal_type: string) => {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  if (!goal_type.trim()) {
    throw new Error("Goal type is required")
  }

  switch (goal_type) {
    case "Long Term Goal": {
      const usecase = await createLongTermGoalComposition()

      const goalQuery = {
        user_id: session.user.id,
        goal_type,
        goal_category: null,
        start_date: null,
        end_date: null,
      }

      const goals = await usecase.getGoals.execute(goalQuery)
      console.log(goals)

      return goals ?? []
    }

    case "Mid Term Goal": {
      const usecase = await createMidTermGoalComposition()
      const goals = await usecase.getGoals.execute({
        user_id: session.user.id,
        goal_type: "Mid Term Goal",
        goal_category: null,
        start_date: null,
        end_date: null,
      })

      return goals ?? []
    }

    case "Upcoming Responsibilities":
    case "Upcoming Responsibility": {
      const usecase = await createUpcomingResponsibilityGoalComposition()
      const goals = await usecase.getGoals.execute({
        user_id: session.user.id,
        goal_type: "Upcoming Responsibility",
        goal_category: null,
        start_date: null,
        end_date: null,
      })

      return goals ?? []
    }

    case "Daily Task":
    case "Daily Tasks": {
      const usecase = await createDailyTaskGoalComposition()
      const goals = await usecase.getGoals.execute({
        user_id: session.user.id,
        goal_type: "Daily Tasks",
        goal_category: null,
        start_date: null,
        end_date: null,
      })

      return goals ?? []
    }

    
  }
  return []
}

export const handleUpdateGoal = async (input: {
  goal_id: string
  goal_type: string
  field: string
  value: string | number | Date | null
}) => {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const normalizedGoalType =
    input.goal_type === "Upcoming Responsibilities"
      ? "Upcoming Responsibility"
      : input.goal_type === "Daily Task"
        ? "Daily Tasks"
        : input.goal_type

  const usecase = await createLongTermGoalComposition()

  return usecase.updateGoal.execute({
    goal_id: input.goal_id,
    goal_type: normalizedGoalType,
    field: input.field,
    value: input.value,
  })
}


export const handleAddTask = async (input: GoalInputWithoutId) => {
    const session = await auth()
    if (!session?.user?.id) {
            throw new Error("Unauthorized")
    }

    const goalInput = {
      user_id: session.user.id,
      ...input,
      from: input.from ?? new Date(),
    }

    if (input.goal_type === "Long Term Goal") {
      const usecase = await createLongTermGoalComposition()
      await usecase.addGoals.execute(goalInput)
      return
    }

    if (input.goal_type === "Mid Term Goal") {
      const usecase = await createMidTermGoalComposition()
      await usecase.addGoals.execute(goalInput)
      return
    }

    if (input.goal_type === "Upcoming Responsibility") {
      const usecase = await createUpcomingResponsibilityGoalComposition()
      await usecase.addGoals.execute(goalInput)
      return
    }

    if (input.goal_type === "Daily Tasks") {
      const usecase = await createDailyTaskGoalComposition()
      await usecase.addGoals.execute(goalInput)
      return
    }

    throw new Error("Unsupported goal type")


}

export const handleGetGoalById = async (goal_type: string, goal_id: string) => {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const usecase = await createLongTermGoalComposition()
  const goals = await usecase.getGoals.execute({
    user_id: session.user.id,
    goal_type,
    goal_category: null,
    start_date: null,
    end_date: null,
    goal_id,
  })
  return goals[0] ?? null
}

export const handleGetLinkedGoals = async (
  goal_type: string,
  link_field: "ltg_id" | "mtg_id" | "ur_id",
  link_value: string
) => {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const usecase = await createLongTermGoalComposition()
  return usecase.getGoals.execute({
    user_id: session.user.id,
    goal_type,
    goal_category: null,
    start_date: null,
    end_date: null,
    [link_field]: link_value,
  })
}

export const handleDeleteTask = async (goal_type: string, goal_id: string) => {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const usecase = await createLongTermGoalComposition()
  return usecase.deleteGoals.execute({
    user_id: session.user.id,
    goal_type,
    goal_category: null,
    start_date: null,
    end_date: null,
    goal_id,
  })
}

export const handleSaveGoalEdits = async (
  goal_type: string,
  goal_id: string,
  name: string,
  to: Date
) => {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const usecase = await createLongTermGoalComposition()
  await Promise.all([
    usecase.updateGoal.execute({ goal_id, goal_type, field: "name", value: name }),
    usecase.updateGoal.execute({ goal_id, goal_type, field: "to", value: to }),
  ])
}