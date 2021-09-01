import { defaultExceptions } from "./defaultExceptions"

export function toCamel(snake: Array<unknown>, exceptions?: string[], recursionHistory?: string): Array<unknown>
export function toCamel(
	snake: Record<string, unknown>,
	exceptions?: string[],
	recursionHistory?: string
): Record<string, unknown>
export function toCamel<T>(snake: T, exceptions?: string[], recursionHistory?: string): T
export function toCamel(
	snake: Record<string, unknown> | Array<unknown> | unknown,
	exceptions: string[] = defaultExceptions,
	recursionHistory?: string
): Record<string, unknown> | Array<unknown> | unknown {
	return Array.isArray(snake)
		? snake.map(o => toCamel(o, exceptions, `${recursionHistory ? recursionHistory + "." : ""}[*]`))
		: typeof snake == "object" && snake != null
		? Object.entries(snake).reduce<Record<string, unknown>>((result, entry) => {
				const newHistory = `${recursionHistory ? recursionHistory + "." : ""}${entry[0]}`
				return exceptions.some(e => (e.startsWith("*.") ? newHistory.endsWith(e.substring(2)) : newHistory == e))
					? { ...result, [entry[0]]: entry[1] }
					: {
							...result,
							[entry[0].replace(/(_[a-z])/g, group => group.toUpperCase().replace("_", ""))]: toCamel(entry[1]),
					  }
		  }, {})
		: snake
}
