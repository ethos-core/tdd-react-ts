import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useEffect, useRef, useState } from "react";

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
	if (!res.ok) {
		if (res.status === 404) throw new Error("not_found");
		if (res.status === 500) throw new Error("server_error");
		throw new Error("fetch_error");
	}
	return res.json();
}

async function createTask(data: { title: string }): Promise<Task> {
	const res = await fetch("/api/tasks", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("create_error");
	return res.json();
}

async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
	const res = await fetch(`/api/tasks/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("update_error");
	return res.json();
}

async function deleteTaskApi(id: string): Promise<void> {
	const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("delete_error");
}

const TIMEOUT_MS = 10000;

export function TaskApp() {
	const queryClient = useQueryClient();
	const [showForm, setShowForm] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
	const [statusMessage, setStatusMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [timedOut, setTimedOut] = useState(false);
	const titleRef = useRef<HTMLInputElement>(null);

	const {
		data: tasks,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["tasks-app"],
		queryFn: fetchTasks,
		retry: false,
	});

	useEffect(() => {
		if (!isLoading) return;
		const timer = setTimeout(() => setTimedOut(true), TIMEOUT_MS);
		return () => clearTimeout(timer);
	}, [isLoading]);

	const createMutation = useMutation({
		mutationFn: (data: { title: string }) => createTask(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks-app"] });
			if (titleRef.current) titleRef.current.value = "";
		},
		onError: () => {
			setErrorMessage("タスクの追加に失敗しました");
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
			updateTask(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks-app"] });
			setStatusMessage("ステータスを更新しました");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteTaskApi(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks-app"] });
			setDeleteTarget(null);
		},
		onError: () => {
			setDeleteTarget(null);
			setErrorMessage("削除に失敗しました");
		},
	});

	if (isLoading && !timedOut) {
		return <div data-testid="task-skeleton">Loading...</div>;
	}

	if (timedOut && isLoading) {
		return <div>応答がありません</div>;
	}

	if (isError) {
		const msg = (error as Error)?.message;
		if (msg === "not_found") {
			return <div>タスクが見つかりません</div>;
		}
		if (msg === "server_error") {
			return <div>サーバーエラーが発生しました</div>;
		}
		return (
			<div>
				<p>ネットワークエラー</p>
				<button type="button" onClick={() => refetch()}>
					再試行
				</button>
			</div>
		);
	}

	return (
		<div>
			{statusMessage && <p>{statusMessage}</p>}
			{errorMessage && <p>{errorMessage}</p>}

			<button type="button" onClick={() => setShowForm(true)}>
				タスクを追加
			</button>

			{showForm && (
				<TaskAppForm
					titleRef={titleRef}
					onSubmit={(title) => createMutation.mutate({ title })}
					onCancel={() => setShowForm(false)}
				/>
			)}

			<ul>
				{tasks?.map((task) => (
					<li key={task.id} data-testid="task-card">
						<span>{task.title}</span>
						<select
							data-testid="status-select"
							value={task.status}
							onChange={(e) =>
								updateMutation.mutate({
									id: task.id,
									data: { status: e.target.value },
								})
							}
						>
							<option value="todo">未着手</option>
							<option value="in_progress">進行中</option>
							<option value="done">完了</option>
						</select>
						<button
							type="button"
							aria-label="削除"
							onClick={() => setDeleteTarget(task.id)}
						>
							削除
						</button>
					</li>
				))}
			</ul>

			{deleteTarget && (
				<div role="dialog">
					<p>このタスクを削除しますか？</p>
					<button
						type="button"
						onClick={() => deleteMutation.mutate(deleteTarget)}
					>
						削除する
					</button>
					<button type="button" onClick={() => setDeleteTarget(null)}>
						キャンセル
					</button>
				</div>
			)}
		</div>
	);
}

function TaskAppForm({
	titleRef,
	onSubmit,
	onCancel,
}: {
	titleRef: React.RefObject<HTMLInputElement | null>;
	onSubmit: (title: string) => void;
	onCancel: () => void;
}) {
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const title = titleRef.current?.value ?? "";
		if (title.trim()) {
			onSubmit(title.trim());
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="task-app-title">タイトル</label>
			<input ref={titleRef} id="task-app-title" type="text" />
			<button type="submit">追加</button>
			<button type="button" onClick={onCancel}>
				キャンセル
			</button>
		</form>
	);
}
