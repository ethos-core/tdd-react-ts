import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { TaskBoard } from "../../components/features/TaskBoard";
import { server } from "../../test/mocks/server";
import { render, screen, waitFor, within } from "../../test/test-utils";

describe("Task management API integration", () => {
	const user = userEvent.setup();

	it("fetches and displays the task list from API on page load", async () => {
		render(<TaskBoard />);

		expect(screen.getByText("Loading...")).toBeInTheDocument();

		await waitFor(() => {
			expect(screen.getByText("Setup")).toBeInTheDocument();
		});

		expect(screen.getByText("Add tests")).toBeInTheDocument();
	});

	it("adds a new task to the list after creation", async () => {
		render(<TaskBoard />);

		await screen.findByText("Setup");

		await user.click(screen.getByRole("button", { name: /Add Task/i }));
		await user.type(screen.getByLabelText("Title"), "New Task");
		await user.click(screen.getByRole("button", { name: "Add" }));

		await waitFor(() => {
			expect(screen.getByText("New Task")).toBeInTheDocument();
		});
	});

	it("displays an error message on API error", async () => {
		server.use(
			http.get("/api/tasks", () => {
				return HttpResponse.json(
					{ message: "Internal Server Error" },
					{ status: 500 },
				);
			}),
		);

		render(<TaskBoard />);

		await waitFor(() => {
			expect(screen.getByText(/An error occurred/)).toBeInTheDocument();
		});
	});

	it("displays a retry button on network error", async () => {
		server.use(
			http.get("/api/tasks", () => {
				return HttpResponse.error();
			}),
		);

		render(<TaskBoard />);

		await waitFor(() => {
			expect(screen.getByRole("button", { name: /Retry/ })).toBeInTheDocument();
		});
	});

	it("removes the task from the list after deletion", async () => {
		render(<TaskBoard />);

		const taskElement = await screen.findByText("Add tests");

		const taskCard = taskElement.closest(
			"[data-testid='task-card']",
		) as HTMLElement;
		await user.click(within(taskCard).getByRole("button", { name: /Delete/i }));

		await user.click(screen.getByRole("button", { name: "Confirm Delete" }));

		await waitFor(() => {
			expect(screen.queryByText("Add tests")).not.toBeInTheDocument();
		});
	});
});
