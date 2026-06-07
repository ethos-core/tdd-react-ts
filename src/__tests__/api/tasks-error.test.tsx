import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { TaskApp } from "../../components/features/TaskApp";
import { handlers, resetTasks } from "../../mocks/handlers";
import { server } from "../../mocks/server";
import { render, screen } from "../../test/test-utils";

describe("API エラーハンドリング", () => {
	const user = userEvent.setup();

	beforeEach(() => {
		resetTasks();
		server.use(...handlers);
	});

	it("404 エラー: タスクが見つからない", async () => {
		server.use(
			http.get("/api/tasks", () => {
				return HttpResponse.json(
					{ message: "Task not found" },
					{ status: 404 },
				);
			}),
		);

		render(<TaskApp />);

		expect(
			await screen.findByText(/タスクが見つかりません/i),
		).toBeInTheDocument();
	});

	it("500 エラー: サーバーエラー", async () => {
		server.use(
			http.get("/api/tasks", () => {
				return HttpResponse.json(
					{ message: "Internal Server Error" },
					{ status: 500 },
				);
			}),
		);

		render(<TaskApp />);

		expect(
			await screen.findByText(/サーバーエラーが発生しました/i),
		).toBeInTheDocument();
	});

	it("ネットワークエラー", async () => {
		server.use(
			http.get("/api/tasks", () => {
				return HttpResponse.error();
			}),
		);

		render(<TaskApp />);

		expect(await screen.findByText(/ネットワークエラー/i)).toBeInTheDocument();
	});

	it("タスク作成時の 400 エラー", async () => {
		server.use(
			http.post("/api/tasks", () => {
				return HttpResponse.json(
					{
						message: "Validation failed",
						errors: { title: "Title is required" },
					},
					{ status: 400 },
				);
			}),
		);

		render(<TaskApp />);
		await screen.findByText("React コンポーネント設計");

		await user.click(screen.getByRole("button", { name: /タスクを追加/i }));
		await user.type(screen.getByLabelText("タイトル"), "テスト");
		await user.click(screen.getByRole("button", { name: "追加" }));

		expect(
			await screen.findByText(/タスクの追加に失敗しました/i),
		).toBeInTheDocument();
	});

	it("タスク削除時の 404 エラー", async () => {
		server.use(
			http.delete("/api/tasks/:id", () => {
				return HttpResponse.json(
					{ message: "Task not found" },
					{ status: 404 },
				);
			}),
		);

		render(<TaskApp />);
		const task = await screen.findByText("React コンポーネント設計");
		const taskCard = task.closest("[data-testid='task-card']")!;

		await user.click(
			(taskCard as HTMLElement).querySelector("button[aria-label='削除']")!,
		);
		await user.click(screen.getByRole("button", { name: "削除する" }));

		expect(await screen.findByText(/削除に失敗しました/i)).toBeInTheDocument();
	});
});
