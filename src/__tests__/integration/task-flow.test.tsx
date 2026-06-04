import { render, screen, within } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { App } from "../../App";

describe("Task management flow", () => {
  const user = userEvent.setup();

  it("adds a task and displays it on the board", async () => {
    render(<App />);
    
    await user.click(screen.getByRole("button", { name: /Add Task/i }));
    
    await user.type(screen.getByLabelText("Title"), "Write E2E tests");
    await user.selectOptions(screen.getByLabelText("Priority"), "high");
    await user.click(screen.getByRole("button", { name: "Add" }));
    
    expect(screen.getByText("Write E2E tests")).toBeInTheDocument();
  });

  it("removes the task from the board after deletion", async () => {
    render(<App />);
    
    await user.click(screen.getByRole("button", { name: /Add Task/i }));
    await user.type(screen.getByLabelText("Title"), "Write E2E tests");
    await user.click(screen.getByRole("button", { name: "Add" }));
    
    const taskCard = screen.getByText("Write E2E tests").closest("[data-testid='task-card']");
    const deleteButton = within(taskCard!).getByRole("button", { name: /Delete/i });
    await user.click(deleteButton);
    
    await user.click(screen.getByRole("button", { name: "Confirm Delete" }));
    
    expect(screen.queryByText("Write E2E tests")).not.toBeInTheDocument();
  });

  it("reflects changes after editing a task", async () => {
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Add Task/i }));
    await user.type(screen.getByLabelText("Title"), "Original Title");
    await user.click(screen.getByRole("button", { name: "Add" }));

    const taskCard = screen.getByText("Original Title").closest("[data-testid='task-card']");
    await user.click(within(taskCard!).getByRole("button", { name: /Edit/i }));

    const titleInput = screen.getByLabelText("Title");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Title");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Updated Title")).toBeInTheDocument();
    expect(screen.queryByText("Original Title")).not.toBeInTheDocument();
  });

  it("filters tasks by search", async () => {
    render(<App />);

    const addTask = async (title: string) => {
      await user.click(screen.getByRole("button", { name: /Add Task/i }));
      await user.type(screen.getByLabelText("Title"), title);
      await user.click(screen.getByRole("button", { name: "Add" }));
    };

    await addTask("Learn React");
    await addTask("Write tests");
    await addTask("React Testing");

    await user.type(screen.getByPlaceholderText("Search..."), "React");

    expect(screen.getByText("Learn React")).toBeInTheDocument();
    expect(screen.getByText("React Testing")).toBeInTheDocument();
    expect(screen.queryByText("Write tests")).not.toBeInTheDocument();
  });
});
