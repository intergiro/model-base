import { defaultExceptions } from "./defaultExceptions"

export function toSnake(camel: Array<unknown>, exceptions?: string[], recursionHistory?: string): Array<unknown>
export function toSnake(
	camel: Record<string, unknown>,
	exceptions?: string[],
	recursionHistory?: string
): Record<string, unknown>
export function toSnake<T>(camel: T, exceptions?: string[], recursionHistory?: string): T
export function toSnake(
	camel: Record<string, unknown> | Array<unknown> | unknown,
	exceptions: string[] = defaultExceptions,
	recursionHistory?: string
): Record<string, unknown> | Array<unknown> | unknown {
	return Array.isArray(camel)
		? camel.map(c => toSnake(c, exceptions, `${recursionHistory ? recursionHistory + "." : ""}[*]`))
		: typeof camel == "object" && camel != null
		? Object.entries(camel).reduce<Record<string, any>>((result, entry) => {
				const newHistory = `${recursionHistory ? recursionHistory + "." : ""}${entry[0]}`
				return exceptions.some(e => (e.startsWith("*.") ? newHistory.endsWith(e.substring(2)) : newHistory == e))
					? { ...result, [entry[0]]: entry[1] }
					: {
							...result,
							[entry[0].length > 0
								? entry[0][0] +
								  entry[0].substring(1, entry[0].length).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
								: ""]: toSnake(entry[1], exceptions, newHistory),
					  }
		  }, {})
		: camel
}
