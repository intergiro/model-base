import { Base } from "./Base"

export interface Refund extends Base {
	type: "refund"
	descriptor?: string
}

export namespace Refund {
	export function is(value: Refund | any): value is Refund {
		return (
			Base.is(value) && value.type == "refund" && (value.descriptor == undefined || typeof value.descriptor == "string")
		)
	}
}
