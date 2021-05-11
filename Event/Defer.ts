import { Base } from "./Base"

export interface Defer extends Base {
	type: "defer"
}

export namespace Defer {
	export function is(value: Defer | any): value is Defer {
		return Base.is(value) && value.type == "defer"
	}
}
