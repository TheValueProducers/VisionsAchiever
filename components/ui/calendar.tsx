"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"

type CalendarProps =
  | {
      mode?: "single"
      selected?: Date
      onSelect?: (date: Date | undefined) => void
      className?: string
    }
  | {
      mode: "range"
      selected?: DateRange
      onSelect?: (range: DateRange | undefined) => void
      className?: string
    }

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function toStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getMonthGrid(monthDate: Date) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const startOffset = firstDayOfMonth.getDay()
  const gridStart = new Date(year, month, 1 - startOffset)

  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(gridStart)
    day.setDate(gridStart.getDate() + i)
    return day
  })
}

function isDateInRange(date: Date, range?: DateRange) {
  if (!range?.from) return false

  const current = toStartOfDay(date)
  const from = toStartOfDay(range.from)

  if (!range.to) {
    return isSameDay(current, from)
  }

  const to = toStartOfDay(range.to)
  const start = from <= to ? from : to
  const end = from <= to ? to : from

  return current >= start && current <= end
}

export function Calendar(props: CalendarProps) {
  const today = toStartOfDay(new Date())

  const initialVisibleMonth =
    props.mode === "range"
      ? props.selected?.from
        ? toStartOfDay(props.selected.from)
        : today
      : props.selected
      ? toStartOfDay(props.selected)
      : today

  const [visibleMonth, setVisibleMonth] = React.useState<Date>(
    new Date(
      initialVisibleMonth.getFullYear(),
      initialVisibleMonth.getMonth(),
      1
    )
  )

  React.useEffect(() => {
    if (props.mode === "range") {
      if (props.selected?.from) {
        const from = toStartOfDay(props.selected.from)
        setVisibleMonth(new Date(from.getFullYear(), from.getMonth(), 1))
      }
    } else {
      if (props.selected) {
        const selected = toStartOfDay(props.selected)
        setVisibleMonth(new Date(selected.getFullYear(), selected.getMonth(), 1))
      }
    }
  }, [props])

  const monthStart = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1
  )
  const days = getMonthGrid(monthStart)

  const goPrevMonth = () => {
    setVisibleMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    )
  }

  const goNextMonth = () => {
    setVisibleMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    )
  }

  const handleDayClick = (date: Date) => {
    const normalizedDate = toStartOfDay(date)

    if (props.mode === "range") {
      const currentRange = props.selected

      if (!currentRange?.from || (currentRange.from && currentRange.to)) {
        props.onSelect?.({
          from: normalizedDate,
          to: undefined,
        })
        return
      }

      if (currentRange.from && !currentRange.to) {
        if (normalizedDate < toStartOfDay(currentRange.from)) {
          props.onSelect?.({
            from: normalizedDate,
            to: toStartOfDay(currentRange.from),
          })
        } else {
          props.onSelect?.({
            from: toStartOfDay(currentRange.from),
            to: normalizedDate,
          })
        }
      }

      return
    }

    props.onSelect?.(normalizedDate)
  }

  return (
    <div className={cn("rounded-lg border border-border/60 bg-card p-3", props.className)}>
      <div className="mb-3 flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon-sm" onClick={goPrevMonth}>
          <ChevronLeftIcon className="size-4" />
        </Button>
        <p className="text-sm font-semibold">
          {monthStart.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <Button type="button" variant="ghost" size="icon-sm" onClick={goNextMonth}>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1 font-medium">
            {label}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((date) => {
          const normalizedDate = toStartOfDay(date)
          const inVisibleMonth = date.getMonth() === monthStart.getMonth()
          const isToday = isSameDay(date, today)

          const isSelectedSingle =
            props.mode === "range"
              ? false
              : props.selected
              ? isSameDay(normalizedDate, toStartOfDay(props.selected))
              : false

          const isRangeStart =
            props.mode === "range" && props.selected?.from
              ? isSameDay(normalizedDate, toStartOfDay(props.selected.from))
              : false

          const isRangeEnd =
            props.mode === "range" && props.selected?.to
              ? isSameDay(normalizedDate, toStartOfDay(props.selected.to))
              : false

          const isInRange =
            props.mode === "range"
              ? isDateInRange(normalizedDate, props.selected)
              : false

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => handleDayClick(date)}
              className={cn(
                "h-9 rounded-md text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                !inVisibleMonth && "text-muted-foreground/40",
                isToday && "border border-border/70",
                isSelectedSingle && "bg-primary text-primary-foreground hover:bg-primary/90",
                isInRange && "bg-accent text-accent-foreground",
                (isRangeStart || isRangeEnd) &&
                  "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}