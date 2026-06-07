const WHITESPACE = /\s+/g;
const NON_SLUG_CHARS =
	/[^a-z0-9\u3000-\u9FFF\u{F900}-\u{FAFF}\u{FF00}-\u{FFEF}-]/gu;
const CONSECUTIVE_HYPHENS = /-+/g;
const LEADING_TRAILING_HYPHENS = /^-+|-+$/g;

type SlugTransform = (input: string) => string;

const transforms: SlugTransform[] = [
	(s) => s.toLowerCase(),
	(s) => s.replace(WHITESPACE, "-"),
	(s) => s.replace(NON_SLUG_CHARS, "-"),
	(s) => s.replace(CONSECUTIVE_HYPHENS, "-"),
	(s) => s.replace(LEADING_TRAILING_HYPHENS, ""),
];

export function slugify(input: string): string {
	if (input === "") return "";
	return transforms.reduce((result, transform) => transform(result), input);
}
