"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguageContext } from "@/components/context/languageWrapper"
import {
	handleDeleteTask,
	handleGetGoalById,
	handleUpdateGoal,
} from "@/app/actions/tasks"
import type { GoalItem } from "@/core/usecases/types/GoalQuery"

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

export default function EditDailyTaskPage({ taskId }: { taskId: string }) {
	const { t } = useLanguageContext()
	const router = useRouter()

	const [task, setTask] = useState<GoalItem | null>(null)
	const [loading, setLoading] = useState(true)
	const [loadError, setLoadError] = useState<string | null>(null)

	const [editName, setEditName] = useState("")
	const [editFrom, setEditFrom] = useState("")
	const [editDue, setEditDue] = useState("")
	const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
	const [saveError, setSaveError] = useState("")
	const [isDeleting, setIsDeleting] = useState(false)

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true)
				setLoadError(null)

				const dailyTask = await handleGetGoalById("Daily Tasks", taskId)

				if (!dailyTask) {
					setLoadError(t("goalNotFound"))
					return
				}

				setTask(dailyTask)
				setEditName(dailyTask.name ?? "")
				setEditFrom(toDatetimeLocal(dailyTask.from))
				setEditDue(toDatetimeLocal(dailyTask.to))
			} catch (error) {
				console.error(error)
				setLoadError("Failed to load task.")
			} finally {
				setLoading(false)
			}
		}

		void loadData()
	}, [taskId, t])

	const handleSave = async () => {
		if (!task) return

		setSaveError("")

		if (!editName.trim()) {
			setSaveError("Task name is required.")
			return
		}

		if (!editFrom || !editDue) {
			setSaveError("Start and due date are required.")
			return
		}

		setSaveStatus("saving")

		try {
			await Promise.all([
				handleUpdateGoal({ goal_id: taskId, goal_type: "Daily Tasks", field: "name", value: editName.trim() }),
				handleUpdateGoal({ goal_id: taskId, goal_type: "Daily Tasks", field: "from", value: new Date(editFrom) }),
				handleUpdateGoal({ goal_id: taskId, goal_type: "Daily Tasks", field: "to", value: new Date(editDue) }),
			])
			setTask((previous) =>
				previous
					? { ...previous, name: editName.trim(), from: new Date(editFrom), to: new Date(editDue) }
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
			await handleDeleteTask("Daily Tasks", taskId)
			router.push("/create-task")
		} catch (error) {
			console.error(error)
			setIsDeleting(false)
		}
	}

	if (loading) {
		return (
			<div className="mx-auto w-full max-w-4xl space-y-4 p-4 md:p-6">
				<Skeleton className="h-64 w-full rounded-3xl" />
			</div>
		)
	}

	if (loadError || !task) {
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
						{t("editDailyTask")}
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
							{t("from")}:
						</Label>
						<Input
							type="datetime-local"
							value={editFrom}
							onChange={(event) => setEditFrom(event.target.value)}
							className="h-11 rounded-xl"
						/>
					</div>

					<div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[160px_1fr]">
						<Label className="text-base font-semibold text-slate-900">
							{t("to")}:
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
		</div>
	)
}
