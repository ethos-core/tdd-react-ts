import { describe, expect, it } from "vitest";
import { slugify } from "../slugify";

describe("slugify", () => {
	describe("basic conversion", () => {
		it("converts spaces to hyphens", () => {
			expect(slugify("hello world")).toBe("hello-world");
		});

		it("converts uppercase to lowercase", () => {
			expect(slugify("Hello World")).toBe("hello-world");
		});

		it("replaces non-alphanumeric characters with hyphens", () => {
			expect(slugify("hello!@#$%world")).toBe("hello-world");
		});

		it("collapses consecutive hyphens into one", () => {
			expect(slugify("hello   world")).toBe("hello-world");
		});

		it("removes leading and trailing hyphens", () => {
			expect(slugify("  hello world  ")).toBe("hello-world");
		});
	});

	describe("Japanese support", () => {
		it("preserves Japanese characters", () => {
			expect(slugify("React 入門")).toBe("react-入門");
		});

		it("handles Japanese-only strings", () => {
			expect(slugify("テスト駆動開発")).toBe("テスト駆動開発");
		});

		it("handles mixed Japanese and English strings", () => {
			expect(slugify("Phase 9 ハンズオン")).toBe("phase-9-ハンズオン");
		});
	});

	describe("edge cases", () => {
		it("returns an empty string for empty input", () => {
			expect(slugify("")).toBe("");
		});

		it("returns an empty string for symbol-only input", () => {
			expect(slugify("!@#$%^&*()")).toBe("");
		});

		it("handles numeric-only strings", () => {
			expect(slugify("123 456")).toBe("123-456");
		});

		it("returns an already-slugified string as-is", () => {
			expect(slugify("already-a-slug")).toBe("already-a-slug");
		});

		it("converts tabs and newlines to hyphens", () => {
			expect(slugify("hello\tworld\nfoo")).toBe("hello-world-foo");
		});

		it("handles very long strings", () => {
			const longStr = "a ".repeat(100).trim();
			const result = slugify(longStr);
			expect(result).toBe(Array(100).fill("a").join("-"));
		});
	});
});
