import { Base } from "./Base"

export interface Cancel extends Base {
	type: "cancel"
}

export namespace Cancel {
	export function is(value: Cancel | any): value is Cancel {
		return Base.is(value) && value.type == "cancel"
	}
}
