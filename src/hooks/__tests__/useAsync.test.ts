import { act, renderHook, waitFor } from "@testing-library/react";
import { useAsync } from "../useAsync";

describe("useAsync", () => {
	it("has idle as the initial state", () => {
		const { result } = renderHook(() => useAsync());

		expect(result.current.status).toBe("idle");
		expect(result.current.data).toBeNull();
		expect(result.current.error).toBeNull();
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.isSuccess).toBe(false);
	});

	it("transitions to loading state when execute is called", () => {
		const mockFn = vi.fn(
			() => new Promise((resolve) => setTimeout(() => resolve("data"), 100)),
		);
		const { result } = renderHook(() => useAsync());

		act(() => {
			result.current.execute(mockFn);
		});

		expect(result.current.status).toBe("loading");
		expect(result.current.isLoading).toBe(true);
	});

	it("stores data when the async operation succeeds", async () => {
		const mockData = { id: 1, name: "test" };
		const mockFn = vi.fn().mockResolvedValue(mockData);
		const { result } = renderHook(() => useAsync());

		await act(() => {
			result.current.execute(mockFn);
		});

		expect(result.current.status).toBe("success");
		expect(result.current.data).toEqual(mockData);
		expect(result.current.isSuccess).toBe(true);
		expect(result.current.isLoading).toBe(false);
	});

	it("stores the error when the async operation fails", async () => {
		const mockError = new Error("API Error");
		const mockFn = vi.fn().mockRejectedValue(mockError);
		const { result } = renderHook(() => useAsync());

		await act(() => {
			result.current.execute(mockFn);
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toEqual(mockError);
		expect(result.current.isError).toBe(true);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeNull();
	});

	it("resets to the initial state", async () => {
		const mockFn = vi.fn().mockResolvedValue("data");
		const { result } = renderHook(() => useAsync());

		await act(async () => {
			await result.current.execute(mockFn);
		});

		expect(result.current.status).toBe("success");

		act(() => {
			result.current.reset();
		});

		expect(result.current.status).toBe("idle");
		expect(result.current.data).toBeNull();
		expect(result.current.error).toBeNull();
	});

	it("only reflects the last result on consecutive executions", async () => {
		let callCount = 0;
		const slowFn = vi.fn(
			() =>
				new Promise((resolve) => {
					callCount++;
					const currentCall = callCount;
					setTimeout(
						() => resolve(`result-${currentCall}`),
						currentCall === 1 ? 200 : 50,
					);
				}),
		);
		const { result } = renderHook(() => useAsync());

		await act(async () => {
			result.current.execute(slowFn);
			await new Promise((r) => setTimeout(r, 10));
			await result.current.execute(slowFn);
		});

		await waitFor(() => {
			expect(result.current.data).toBe("result-2");
		});
	});

	it("executes a callback function passed to execute", async () => {
		const fetchUser = vi.fn().mockResolvedValue({ id: 1, name: "John Doe" });
		const { result } = renderHook(() => useAsync());

		await act(async () => {
			await result.current.execute(fetchUser);
		});

		expect(fetchUser).toHaveBeenCalledTimes(1);
		expect(result.current.data).toEqual({ id: 1, name: "John Doe" });
	});
});
