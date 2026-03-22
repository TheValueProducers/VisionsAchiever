"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams} from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguageContext } from "@/components/context/languageWrapper"
import type { TranslationKey } from "@/lib/i18n"
import {
	handleDeleteTask,
	handleGetGoalById,
	handleGetLinkedGoals,
	handleSaveGoalEdits,
	handleUpdateGoal,
} from "@/app/actions/tasks"
import type { GoalItem } from "@/core/usecases/types/GoalQuery"

type GoalProgressStatus = "Not Started" | "In Progress" | "Completed"

function formatDate(to: Date | string, from?: Date | string) {
	const toDate = new Date(to)
	if (Number.isNaN(toDate.getTime())) return "Invalid date"

	if (from) {
		const fromDate = new Date(from)
		if (Number.isNaN(fromDate.getTime())) return "Invalid date"

		const sameDay =
			fromDate.getFullYear() === toDate.getFullYear() &&
			fromDate.getMonth() === toDate.getMonth() &&
			fromDate.getDate() === toDate.getDate()

		if (sameDay) {
			return `${fromDate.toLocaleString()} - ${toDate.toLocaleTimeString()}`
		}

		return `${fromDate.toLocaleString()} - ${toDate.toLocaleString()}`
	}

	return toDate.toLocaleString()
}

function toDatetimeLocal(date: Date | string): string {
	const parsedDate = new Date(date)
	if (Number.isNaN(parsedDate.getTime())) return ""

	const year = parsedDate.getFullYear()
	const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
	const day = String(parsedDate.getDate()).padStart(2, "0")
	const hours = String(parsedDate.getHours()).padStart(2, "0")
	const minutes = String(parsedDate.getMinutes()).padStart(2, "0")

	return `${year}-${month}-${day}T${hours}:${minutes}`
}

function getStatusClasses(status: GoalProgressStatus) {
	if (status === "Not Started") {
		return "bg-red-100 text-red-800 hover:bg-red-200"
	}

	if (status === "In Progress") {
		return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
	}

	return "bg-green-100 text-green-800 hover:bg-green-200"
}

function cycleStatus(status: GoalProgressStatus): GoalProgressStatus {
	if (status === "Not Started") return "In Progress"
	if (status === "In Progress") return "Completed"
	return "Not Started"
}

function GoalTableSection({
	title,
	goals,
	goalType,
	showCategory = false,
	showFrom = false,
	goalStatuses,
	onToggleStatus,
	t,
}: {
	title: string
	goals: GoalItem[]
	goalType: string
	showCategory?: boolean
	showFrom?: boolean
	goalStatuses: Record<string, GoalProgressStatus>
	onToggleStatus: (goal: GoalItem, goalType: string) => void
	t: (key: TranslationKey) => string
}) {
	const colCount = showCategory ? 4 : 3
   

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<table className="w-full min-w-[500px] border-collapse text-sm">
						<thead>
							<tr className="border-b text-left">
								<th className="px-3 py-2 font-medium">{t("task")}</th>
								{showCategory ? (
									<th className="px-3 py-2 font-medium">{t("category")}</th>
								) : null}
								<th className="px-3 py-2 font-medium">
									{showFrom ? t("time") : t("due")}
								</th>
								<th className="px-3 py-2 font-medium">{t("completed")}</th>
							</tr>
						</thead>
						<tbody>
							{goals.length === 0 ? (
								<tr>
									<td colSpan={colCount} className="px-3 py-4 text-slate-500">
										{t("noItemsFound")}
									</td>
								</tr>
							) : (
								goals.map((goal, index) => {
									const goalId = goal._id ?? goal.id ?? ""
									const status = goalStatuses[goalId] ?? goal.completed

									return (
										<tr key={goalId} className="border-b">
											<td className="px-3 py-2">{goal.name}</td>
											{showCategory ? (
												<td className="px-3 py-2">{goal.goal_category || "-"}</td>
											) : null}
											<td className="px-3 py-2">
												{showFrom ? formatDate(goal.to, goal.from) : formatDate(goal.to)}
											</td>
											<td className="px-3 py-2">
												<Button
													type="button"
													variant="ghost"
													className={[
														"h-8 rounded-md px-3 text-xs font-semibold",
														getStatusClasses(status),
													].join(" ")}
													onClick={() => onToggleStatus(goal, goalType)}
												>
													{status}
												</Button>
											</td>
										</tr>
									)
								})
							)}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	)
}

export default function EditLTGPage({ ltgId }: { ltgId: string }) {
	const { t } = useLanguageContext()
	const router = useRouter()
    
    

	const [ltg, setLtg] = useState<GoalItem | null>(null)
	const [midTermGoals, setMidTermGoals] = useState<GoalItem[]>([])
	const [upcomingResponsibilities, setUpcomingResponsibilities] = useState<GoalItem[]>([])
	const [dailyTasks, setDailyTasks] = useState<GoalItem[]>([])
	const [loading, setLoading] = useState(true)
	const [loadError, setLoadError] = useState<string | null>(null)

	const [editName, setEditName] = useState("")
	const [editDue, setEditDue] = useState("")
	const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
	const [saveError, setSaveError] = useState("")
	const [isDeleting, setIsDeleting] = useState(false)
	const [goalStatuses, setGoalStatuses] = useState<Record<string, GoalProgressStatus>>({})

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true)
				setLoadError(null)

				const longTermGoal = await handleGetGoalById("Long Term Goal", ltgId)

				if (!longTermGoal) {
					setLoadError(t("goalNotFound"))
					return
				}

				setLtg(longTermGoal)
				setEditName(longTermGoal.name ?? "")
				setEditDue(toDatetimeLocal(longTermGoal.to))

				const linkedMidTermGoals = longTermGoal.ltg_id
					? await handleGetLinkedGoals("Mid Term Goal", "ltg_id", longTermGoal.ltg_id)
					: []
				setMidTermGoals(linkedMidTermGoals)

				const upcomingGroups = await Promise.all(
					linkedMidTermGoals
						.filter((goal) => goal.mtg_id)
						.map((goal) =>
							handleGetLinkedGoals("Upcoming Responsibility", "mtg_id", goal.mtg_id as string)
						)
				)
				const linkedUpcomingResponsibilities = upcomingGroups.flat()
				setUpcomingResponsibilities(linkedUpcomingResponsibilities)

				const dailyTaskGroups = await Promise.all(
					linkedUpcomingResponsibilities
						.filter((goal) => goal.ur_id)
						.map((goal) => handleGetLinkedGoals("Daily Tasks", "ur_id", goal.ur_id as string))
				)
				const linkedDailyTasks = dailyTaskGroups.flat()
				setDailyTasks(linkedDailyTasks)

				const nextStatuses: Record<string, GoalProgressStatus> = {}
				for (const goal of [
					...linkedMidTermGoals,
					...linkedUpcomingResponsibilities,
					...linkedDailyTasks,
				]) {
					const goalId = goal._id ?? goal.id ?? ""
					if (goalId) {
						nextStatuses[goalId] = goal.completed
					}
				}
				setGoalStatuses(nextStatuses)
			} catch (error) {
				console.error(error)
				setLoadError("Failed to load goal.")
			} finally {
				setLoading(false)
			}
		}

		void loadData()
	}, [ltgId, t])

	const handleSave = async () => {
		if (!ltg) return

		setSaveError("")

		if (!editName.trim()) {
			setSaveError("Goal name is required.")
			return
		}

		if (!editDue) {
			setSaveError("Due date is required.")
			return
		}

		setSaveStatus("saving")

		try {
			await handleSaveGoalEdits("Long Term Goal", ltgId, editName.trim(), new Date(editDue))
			setLtg((previous) =>
				previous
					? {
							...previous,
							name: editName.trim(),
							to: new Date(editDue),
						}
					: previous
			)
			setSaveStatus("success")
			setTimeout(() => setSaveStatus("idle"), 2500)
		} catch (error) {
			setSaveStatus("error")
			setSaveError(error instanceof Error ? error.message : "Failed to save.")
		}
	}

	const handleDelete = async () => {
		if (!confirm(t("confirmDeleteGoal"))) return

		setIsDeleting(true)
		try {
			await handleDeleteTask("Long Term Goal", ltgId)
			router.push("/create-task")
		} catch (error) {
			console.error(error)
			setIsDeleting(false)
		}
	}

	const handleToggleStatus = async (goal: GoalItem, goalType: string) => {
		const goalId = goal._id ?? goal.id ?? ""
		const currentStatus = goalStatuses[goalId] ?? goal.completed
		const nextStatus = cycleStatus(currentStatus)

		setGoalStatuses((previous) => ({
			...previous,
			[goalId]: nextStatus,
		}))

		try {
			await handleUpdateGoal({
				goal_id: goalId,
				goal_type: goalType,
				field: "completed",
				value: nextStatus,
			})
		} catch {
			setGoalStatuses((previous) => ({
				...previous,
				[goalId]: currentStatus,
			}))
		}
	}

	if (loading) {
		return (
			<div className="mx-auto w-full max-w-4xl space-y-4 p-4 md:p-6">
				<Skeleton className="h-64 w-full rounded-3xl" />
				<Skeleton className="h-40 w-full rounded-xl" />
				<Skeleton className="h-40 w-full rounded-xl" />
			</div>
		)
	}

	if (loadError || !ltg) {
		return (
			<div className="mx-auto w-full max-w-4xl p-4 md:p-6">
				<p className="text-destructive">{loadError ?? t("goalNotFound")}</p>
			</div>
		)
	}

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
			<Card className="rounded-3xl border-slate-200 shadow-sm">
				<CardHeader className="pb-2">
					<CardTitle className="text-3xl font-black tracking-tight text-slate-950">
						{t("editLongTermGoal")}
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-6 pt-4">
					<div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[160px_1fr]">
						<Label className="text-base font-semibold text-slate-900">
							{t("goalName")}:
						</Label>
						<Input
							value={editName}
							onChange={(event) => setEditName(event.target.value)}
							placeholder={t("enterTaskName")}
							className="h-11 rounded-xl"
						/>
					</div>

					<div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[160px_1fr]">
						<Label className="text-base font-semibold text-slate-900">
							{t("due")}:
						</Label>
						<Input
							type="datetime-local"
							value={editDue}
							onChange={(event) => setEditDue(event.target.value)}
							className="h-11 rounded-xl"
						/>
					</div>

					{saveError ? <p className="text-sm text-destructive">{saveError}</p> : null}
					{saveStatus === "success" ? (
						<p className="text-sm text-green-600">{t("savedSuccessfully")}</p>
					) : null}

					<div className="flex gap-3 pt-2">
						<Button
							onClick={() => void handleSave()}
							disabled={saveStatus === "saving"}
							className="rounded-xl px-6"
						>
							{t("saveChanges")}
						</Button>
						<Button
							variant="destructive"
							onClick={() => void handleDelete()}
							disabled={isDeleting}
							className="rounded-xl px-6"
						>
							{t("deleteGoal")}
						</Button>
					</div>
				</CardContent>
			</Card>

			<GoalTableSection
				title={t("linkedMidTermGoals")}
				goals={midTermGoals}
				goalType="Mid Term Goal"
				showCategory
				goalStatuses={goalStatuses}
				onToggleStatus={handleToggleStatus}
				t={t}
			/>

		</div>
	)
}
