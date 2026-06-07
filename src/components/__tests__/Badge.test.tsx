import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "../Badge";

describe("Badge", () => {
	it("renders a high priority badge", () => {
		const { container } = render(<Badge priority="high" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	it("renders a medium priority badge", () => {
		const { container } = render(<Badge priority="medium" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	it("renders a low priority badge", () => {
		const { container } = render(<Badge priority="low" />);
		expect(container.firstChild).toMatchSnapshot();
	});
});
