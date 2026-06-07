import { useQuery } from "@tanstack/react-query";

interface Task {
	id: string;
	title: string;
	description: string;
	priority: string;
	status: string;
	createdAt: string;
}

async function fetchTasks(): Promise<Task[]> {
	const res = await fetch("/api/tasks");
	if (!res.ok) throw new Error("Failed to fetch tasks");
	return res.json();
}

export function TaskList() {
	const { data: tasks, isLoading } = useQuery({
		queryKey: ["tasks"],
		queryFn: fetchTasks,
	});

	if (isLoading) {
		return <div role="status">Loading...</div>;
	}

	return (
		<ul>
			{tasks?.map((task) => (
				<li key={task.id} data-testid="task-card">
					{task.title}
				</li>
			))}
		</ul>
	);
}
