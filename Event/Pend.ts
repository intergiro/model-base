import { Base } from "./Base"

export interface Pend extends Base {
	type: "pend"
}

export namespace Pend {
	export function is(value: Pend | any): value is Pend {
		return Base.is(value) && value.type == "pend"
	}
}
