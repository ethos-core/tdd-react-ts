import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "../features/TaskForm";

describe("TaskForm", () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    beforeEach(() => {
        mockOnSubmit.mockClear();
    })

    it("renders the title input field", () => {
        render(<TaskForm onSubmit={mockOnSubmit} />);
        expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    it("does not submit with an empty title", async () => {
        render(<TaskForm onSubmit={mockOnSubmit} />);

        await user.click(screen.getByRole("button", { name: "Add Task" }));

        expect(mockOnSubmit).not.toHaveBeenCalled();
        expect(screen.getByText("Title is required")).toBeInTheDocument();
    })

    it("submits with valid input", async () => {
        render(<TaskForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText("Title"), "New Task");
        await user.selectOptions(screen.getByLabelText("Priority"), "high");
        await user.click(screen.getByRole("button", { name: "Add Task" }));

        expect(mockOnSubmit).toHaveBeenCalledWith({
            title: "New Task",
            description: "",
            priority: "high",
        })
    })

    it("resets the form after submission", async () => {
        render(<TaskForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText("Title"), "Test");
        await user.click(screen.getByRole("button", { name: "Add Task" }));

        expect(screen.getByLabelText("Title")).toHaveValue("");
    })

    it("calls onCancel when the cancel button is clicked", async () => {
        const mockOnCancel = vi.fn();
        render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

        await user.click(screen.getByRole("button", { name: "Cancel" }));

        expect(mockOnCancel).toHaveBeenCalled();
    })

    it("shows an error when the title exceeds 100 characters", async () => {
        render(<TaskForm onSubmit={mockOnSubmit} />);

        const longTitle = "a".repeat(101);
        await user.type(screen.getByLabelText("Title"), longTitle);
        await user.click(screen.getByRole("button", { name: "Add Task" }));
        
        expect(screen.getByText("Title must be 100 characters or less")).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    })
})
