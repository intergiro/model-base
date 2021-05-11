import { Base } from "./Base"

export interface Charge extends Base {
	type: "charge"
	descriptor?: string
}

export namespace Charge {
	export function is(value: Charge | any): value is Charge {
		return (
			Base.is(value) && value.type == "charge" && (value.descriptor == undefined || typeof value.descriptor == "string")
		)
	}
}
