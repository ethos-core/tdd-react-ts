import { Badge } from "./Badge";

interface Task {
	id: string;
	title: string;
	description: string;
	priority: "low" | "medium" | "high";
	status: "todo" | "in_progress" | "done";
	createdAt: string;
}

interface TaskCardProps {
	task: Task;
	onDelete: (id: string) => void;
	onEdit: (id: string) => void;
}

export function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
	const isDone = task.status === "done";

	return (
		<div
			data-testid="task-card"
			style={{
				border: "1px solid #e0e0e0",
				borderRadius: "8px",
				padding: "12px",
				opacity: isDone ? 0.6 : 1,
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h3
					style={{
						textDecoration: isDone ? "line-through" : "none",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						maxWidth: "200px",
					}}
				>
					{task.title}
				</h3>
				<Badge priority={task.priority} />
			</div>
			{task.description && (
				<p style={{ marginTop: "4px", fontSize: "0.875rem" }}>
					{task.description}
				</p>
			)}
			<div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
				<button type="button" onClick={() => onEdit(task.id)}>
					Edit
				</button>
				<button type="button" onClick={() => onDelete(task.id)}>
					Delete
				</button>
			</div>
		</div>
	);
}
