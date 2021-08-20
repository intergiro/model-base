export function toCamel(snake: Array<unknown>): Array<unknown>
export function toCamel(snake: Record<string, unknown>): Record<string, unknown>
export function toCamel<T>(snake: T): T
export function toCamel(
	snake: Record<string, unknown> | Array<unknown> | unknown
): Record<string, unknown> | Array<unknown> | unknown {
	return Array.isArray(snake)
		? snake.map(toCamel)
		: typeof snake == "object" && snake != null
		? Object.entries(snake).reduce<Record<string, unknown>>(
				(result, entry) => ({
					...result,
					[entry[0].replace(/(_[a-z])/g, group => group.toUpperCase().replace("_", ""))]: toCamel(entry[1]),
				}),
				{}
		  )
		: snake
}
