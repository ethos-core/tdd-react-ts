import userEvent from "@testing-library/user-event";
import { TaskApp } from "../../components/features/TaskApp";
import { handlers, resetTasks } from "../../mocks/handlers";
import { server } from "../../mocks/server";
import { render, screen, waitFor } from "../../test/test-utils";

describe("タスク作成", () => {
	const user = userEvent.setup();

	beforeEach(() => {
		resetTasks();
		server.use(...handlers);
	});

	it("新しいタスクを作成するとリストに追加される", async () => {
		render(<TaskApp />);

		await screen.findByText("React コンポーネント設計");

		await user.click(screen.getByRole("button", { name: /タスクを追加/i }));
		await user.type(screen.getByLabelText("タイトル"), "新しいタスク");
		await user.click(screen.getByRole("button", { name: "追加" }));

		expect(await screen.findByText("新しいタスク")).toBeInTheDocument();
	});

	it("作成成功時にフォームがリセットされる", async () => {
		render(<TaskApp />);
		await screen.findByText("React コンポーネント設計");

		await user.click(screen.getByRole("button", { name: /タスクを追加/i }));
		await user.type(screen.getByLabelText("タイトル"), "テストタスク");
		await user.click(screen.getByRole("button", { name: "追加" }));

		await screen.findByText("テストタスク");
		await waitFor(() => {
			expect(screen.getByLabelText("タイトル")).toHaveValue("");
		});
	});
});
