export type Audience = "agent" | "private" | "account" | "public"
export namespace Audience {
	export function is(value: Audience | any): value is Audience {
		return value == "agent" || value == "private" || value == "account" || value == "public"
	}
}
