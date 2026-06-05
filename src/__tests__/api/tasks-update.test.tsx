import { render, screen, within } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { TaskApp } from "../../components/features/TaskApp";
import { server } from "../../mocks/server";
import { handlers, resetTasks } from "../../mocks/handlers";

describe("タスク更新", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    resetTasks();
    server.use(...handlers);
  });

  it("タスクのステータスを変更できる", async () => {
    render(<TaskApp />);

    const task = await screen.findByText("React コンポーネント設計");
    const taskCard = task.closest("[data-testid='task-card']")!;

    const statusSelect = within(taskCard as HTMLElement).getByTestId("status-select");
    await user.selectOptions(statusSelect, "in_progress");

    expect(
      await screen.findByText("ステータスを更新しました")
    ).toBeInTheDocument();
  });
});

