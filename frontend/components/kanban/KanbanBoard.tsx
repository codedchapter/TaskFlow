'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Task, TaskStatus } from '@/lib/api'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'

type KanbanBoardProps = {
  tasks: Task[]
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void
}

const COLUMNS: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'todo', title: 'To Do', color: '#6B7280' },
  { status: 'in_progress', title: 'In Progress', color: '#3B82F6' },
  { status: 'review', title: 'Review', color: '#F59E0B' },
  { status: 'done', title: 'Done', color: '#10B981' },
]

export default function KanbanBoard({ tasks, onStatusChange }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    // Check if dropped on a column (status)
    const newStatus = over.id as TaskStatus
    const task = tasks.find(t => t.id === active.id)

    if (task && task.status !== newStatus) {
      onStatusChange(task.id, newStatus)
    }
  }

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter(t => t.status === status && !t.is_deleted)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.status}
            status={column.status}
            title={column.title}
            color={column.color}
            tasks={tasksByStatus(column.status)}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-3">
            <KanbanCard task={activeTask} onStatusChange={onStatusChange} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
