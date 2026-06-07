import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "../features/TaskForm";

describe("TaskForm", () => {
	const mockOnSubmit = vi.fn();
	const user = userEvent.setup();

	beforeEach(() => {
		mockOnSubmit.mockClear();
	});

	it("renders the title input field", () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);
		expect(screen.getByLabelText("Title")).toBeInTheDocument();
	});

	it("does not submit with an empty title", async () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		await user.click(screen.getByRole("button", { name: "Add Task" }));

		expect(mockOnSubmit).not.toHaveBeenCalled();
		expect(screen.getByText("Title is required")).toBeInTheDocument();
	});

	it("submits with valid input", async () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		await user.type(screen.getByLabelText("Title"), "New Task");
		await user.selectOptions(screen.getByLabelText("Priority"), "high");
		await user.click(screen.getByRole("button", { name: "Add Task" }));

		expect(mockOnSubmit).toHaveBeenCalledWith({
			title: "New Task",
			description: "",
			priority: "high",
		});
	});

	it("resets the form after submission", async () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		await user.type(screen.getByLabelText("Title"), "Test");
		await user.click(screen.getByRole("button", { name: "Add Task" }));

		expect(screen.getByLabelText("Title")).toHaveValue("");
	});

	it("calls onCancel when the cancel button is clicked", async () => {
		const mockOnCancel = vi.fn();
		render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

		await user.click(screen.getByRole("button", { name: "Cancel" }));

		expect(mockOnCancel).toHaveBeenCalled();
	});

	it("shows an error when the title exceeds 100 characters", async () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		const longTitle = "a".repeat(101);
		await user.type(screen.getByLabelText("Title"), longTitle);
		await user.click(screen.getByRole("button", { name: "Add Task" }));

		expect(
			screen.getByText("Title must be 100 characters or less"),
		).toBeInTheDocument();
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});
});

describe("TaskForm - keyboard navigation", () => {
	const mockOnSubmit = vi.fn();
	const user = userEvent.setup();

	beforeEach(() => {
		mockOnSubmit.mockClear();
	});

	it("navigates between form elements with the Tab key", async () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		const titleInput = screen.getByLabelText("Title");
		const descriptionInput = screen.getByLabelText("Description");
		const prioritySelect = screen.getByLabelText("Priority");
		const submitButton = screen.getByRole("button", { name: "Add Task" });

		await user.click(titleInput);
		expect(titleInput).toHaveFocus();

		await user.tab();
		expect(descriptionInput).toHaveFocus();

		await user.tab();
		expect(prioritySelect).toHaveFocus();

		await user.tab();
		expect(submitButton).toHaveFocus();
	});

	it("submits the form with the Enter key", async () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		await user.type(screen.getByLabelText("Title"), "Submit with Enter");
		await user.keyboard("{Enter}");

		expect(mockOnSubmit).toHaveBeenCalledWith(
			expect.objectContaining({ title: "Submit with Enter" }),
		);
	});

	it("cancels with the Escape key", async () => {
		const mockOnCancel = vi.fn();
		render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

		await user.type(screen.getByLabelText("Title"), "Test");
		await user.keyboard("{Escape}");

		expect(mockOnCancel).toHaveBeenCalled();
	});
});

describe("TaskForm - focus management", () => {
	const mockOnSubmit = vi.fn();
	const user = userEvent.setup();

	beforeEach(() => {
		mockOnSubmit.mockClear();
	});

	it("returns focus to the title field on validation error", async () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		await user.click(screen.getByRole("button", { name: "Add Task" }));

		expect(screen.getByLabelText("Title")).toHaveFocus();
	});

	it("moves focus to the title field after successful submission", async () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		await user.type(screen.getByLabelText("Title"), "Task");
		await user.click(screen.getByRole("button", { name: "Add Task" }));

		expect(screen.getByLabelText("Title")).toHaveFocus();
	});
});

describe("TaskForm - accessibility", () => {
	const mockOnSubmit = vi.fn();
	const user = userEvent.setup();

	beforeEach(() => {
		mockOnSubmit.mockClear();
	});

	it("sets aria-invalid on error", async () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		expect(screen.getByLabelText("Title")).not.toHaveAttribute("aria-invalid");

		await user.click(screen.getByRole("button", { name: "Add Task" }));

		expect(screen.getByLabelText("Title")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
	});

	it("associates the error message via aria-describedby", async () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		await user.click(screen.getByRole("button", { name: "Add Task" }));

		const titleInput = screen.getByLabelText("Title");
		const describedBy = titleInput.getAttribute("aria-describedby");
		expect(describedBy).toBeTruthy();

		const errorMessage = document.getElementById(describedBy!);
		expect(errorMessage).toHaveTextContent("Title is required");
	});

	it("renders the error message with role='alert'", async () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		await user.click(screen.getByRole("button", { name: "Add Task" }));

		expect(screen.getByRole("alert")).toHaveTextContent("Title is required");
	});

	it("associates labels with all input fields", () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		expect(screen.getByLabelText("Title")).toBeInTheDocument();
		expect(screen.getByLabelText("Description")).toBeInTheDocument();
		expect(screen.getByLabelText("Priority")).toBeInTheDocument();
	});

	it("sets appropriate type attributes on input fields", () => {
		render(<TaskForm onSubmit={mockOnSubmit} />);

		expect(screen.getByLabelText("Title")).toHaveAttribute("type", "text");
		expect(screen.getByLabelText("Priority").tagName).toBe("SELECT");
	});
});
