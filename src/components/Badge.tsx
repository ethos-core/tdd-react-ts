const priorityStyles: Record<
	string,
	{ backgroundColor: string; color: string }
> = {
	high: { backgroundColor: "#fee2e2", color: "#dc2626" },
	medium: { backgroundColor: "#fef3c7", color: "#d97706" },
	low: { backgroundColor: "#dcfce7", color: "#16a34a" },
};

const priorityLabels: Record<string, string> = {
	high: "High",
	medium: "Medium",
	low: "Low",
};

interface BadgeProps {
	priority: string;
}

export function Badge({ priority }: BadgeProps) {
	const style = priorityStyles[priority] ?? priorityStyles.medium;
	const label = priorityLabels[priority] ?? priority;

	return (
		<span
			style={{
				...style,
				padding: "2px 8px",
				borderRadius: "9999px",
				fontSize: "0.75rem",
				fontWeight: 600,
			}}
		>
			{label}
		</span>
	);
}
