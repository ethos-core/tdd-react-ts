import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskCard } from "../TaskCard";

const mockTask = {
	id: "1",
	title: "Test task",
	description: "Description text",
	priority: "high" as const,
	status: "todo" as const,
	createdAt: "2026-01-15T00:00:00Z",
};

describe("TaskCard snapshot", () => {
	it("renders a card in normal state", () => {
		const { container } = render(
			<TaskCard task={mockTask} onDelete={() => {}} onEdit={() => {}} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("renders a card in done state", () => {
		const doneTask = { ...mockTask, status: "done" as const };
		const { container } = render(
			<TaskCard task={doneTask} onDelete={() => {}} onEdit={() => {}} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("renders a card with a long title", () => {
		const longTask = {
			...mockTask,
			title: "A very long task title that should be truncated with ellipsis",
		};
		const { container } = render(
			<TaskCard task={longTask} onDelete={() => {}} onEdit={() => {}} />,
		);
		expect(container).toMatchSnapshot();
	});
});
