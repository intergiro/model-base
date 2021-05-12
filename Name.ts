export interface Name {
	first?: string
	last?: string
}
export namespace Name {
	export function is(value: Name | any): value is Name {
		return (
			typeof value == "object" &&
			(typeof value.first == "string" || value.first == undefined) &&
			(typeof value.last == "string" || value.last == undefined)
		)
	}
	export function get(name: string | Name): string {
		return typeof name == "string"
			? name
			: typeof name == "object"
			? [name.first, name.last].filter(n => !!n).join(" ")
			: ""
	}
}
