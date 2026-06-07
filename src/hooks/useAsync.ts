import { useCallback, useRef, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

interface UseAsyncReturn<T> {
	status: Status;
	data: T | null;
	error: Error | null;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	execute: (asyncFunction: () => Promise<T>) => Promise<void>;
	reset: () => void;
}

export function useAsync<T = unknown>(): UseAsyncReturn<T> {
	const [status, setStatus] = useState<Status>("idle");
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const executionIdRef = useRef(0);

	const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
		const currentExecutionId = ++executionIdRef.current;
		setStatus("loading");
		setData(null);
		setError(null);

		try {
			const result = await asyncFunction();
			if (currentExecutionId === executionIdRef.current) {
				setData(result);
				setStatus("success");
			}
		} catch (err) {
			if (currentExecutionId === executionIdRef.current) {
				setError(err instanceof Error ? err : new Error(String(err)));
				setStatus("error");
			}
		}
	}, []);

	const reset = useCallback(() => {
		executionIdRef.current++;
		setStatus("idle");
		setData(null);
		setError(null);
	}, []);

	return {
		status,
		data,
		error,
		isLoading: status === "loading",
		isError: status === "error",
		isSuccess: status === "success",
		execute,
		reset,
	};
}
