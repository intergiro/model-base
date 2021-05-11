import { Base } from "./Base"

export interface Deny extends Base {
	type: "deny"
}

export namespace Deny {
	export function is(value: Deny | any): value is Deny {
		return Base.is(value) && value.type == "deny"
	}
}
