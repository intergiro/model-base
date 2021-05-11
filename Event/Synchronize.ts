import { Base } from "./Base"

export interface Synchronize extends Base {
	type: "synchronize"
}

export namespace Synchronize {
	export function is(value: Synchronize | any): value is Synchronize {
		return Base.is(value) && value.type == "synchronize"
	}
}
