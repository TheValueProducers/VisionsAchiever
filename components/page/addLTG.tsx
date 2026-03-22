"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { handleAddTask } from "@/app/actions/tasks";
import { useLanguageContext } from "@/components/context/languageWrapper";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddLTG() {
  const { t } = useLanguageContext();
  const [task, setTask] = useState("");
  const [due, setDue] = useState("");
  const [type, setType] = useState("");
const handleSubmit = async () => {
  try {
    // 1. Validate empty fields
    if (!task.trim()) {
      alert("Please enter a goal name.")
      return
    }

    if (!due) {
      alert("Please select a due date.")
      return
    }

    // 2. Validate date format
    const parsedDate = new Date(due)

    if (isNaN(parsedDate.getTime())) {
      alert("Invalid date format.")
      return
    }

    // Optional: prevent past dates
    if (parsedDate < new Date()) {
      alert("Due date cannot be in the past.")
      return
    }

    // 3. Call server action
    await handleAddTask(
      {
        goal_type: "Long Term Goal",
        name: task.trim(),
        to: parsedDate,
      }
    )

    // 4. Success feedback
    alert("✅ Long Term Goal added successfully!")

    // 5. Reset form
    setTask("")
    setDue("")

  } catch (error: any) {
    console.error(error)
    alert("❌ Failed to add goal. Please try again.")
  }
}
 

  return (
    <div className="min-h-screen  px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-black tracking-tight text-slate-950">
              {t("addLongTermGoal")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[140px_1fr]">
              <Label htmlFor="task" className="text-xl font-semibold text-slate-900">
                {t("longTermGoal")}:
              </Label>
              <Input
                id="task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder={t("enterTaskName")}
                className="h-12 rounded-xl text-base"
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[140px_1fr]">
              <Label htmlFor="from" className="text-xl font-semibold text-slate-900">
                {t("due")}:
              </Label>
              <Input
                id="from"
                type="datetime-local"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="h-12 rounded-xl text-base"
              />
            </div>
         

            

    

            <div className="flex justify-end pt-2">
              <Button className="rounded-xl px-6" onClick={() => handleSubmit()}>{t("addLongTermGoal")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
