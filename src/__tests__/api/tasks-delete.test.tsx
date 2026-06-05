import { render, screen, within, waitFor } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { TaskApp } from "../../components/features/TaskApp";
import { server } from "../../mocks/server";
import { handlers, resetTasks } from "../../mocks/handlers";

describe("タスク削除", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    resetTasks();
    server.use(...handlers);
  });

  it("タスクを削除するとリストから消える", async () => {
    render(<TaskApp />);

    const task = await screen.findByText("React コンポーネント設計");
    const taskCard = task.closest("[data-testid='task-card']")!;

    await user.click(
      within(taskCard as HTMLElement).getByRole("button", { name: /削除/i })
    );
    await user.click(screen.getByRole("button", { name: "削除する" }));

    await waitFor(() => {
      expect(
        screen.queryByText("React コンポーネント設計")
      ).not.toBeInTheDocument();
    });
  });
});