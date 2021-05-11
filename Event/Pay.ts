import { Base } from "./Base"

export interface Pay extends Base {
	type: "pay"
}

export namespace Pay {
	export function is(value: Pay | any): value is Pay {
		return Base.is(value) && value.type == "pay"
	}
}
