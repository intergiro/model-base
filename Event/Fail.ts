import * as gracely from "gracely"
import { Base } from "./Base"
import { Type } from "./Type"

export interface Fail extends Base {
	type: "fail"
	original: Type
	error?: gracely.Error
}

export namespace Fail {
	export function is(value: Fail | any): value is Fail {
		return (
			Base.is(value) &&
			value.type == "fail" &&
			Type.is(value.original) &&
			(value.error == undefined || gracely.Error.is(value.error))
		)
	}
}
