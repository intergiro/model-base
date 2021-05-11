export type Audience = "private" | "public" | ["private", "public"]

export namespace Audience {
	export function is(value: any | Audience): value is Audience {
		return (
			value == "private" ||
			value == "public" ||
			(Array.isArray(value) && value.length == 2 && value[0] == "private" && value[1] == "public")
		)
	}
}
