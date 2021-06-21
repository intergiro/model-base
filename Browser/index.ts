import { Creatable as CCreatable } from "./Creatable"
import * as isoly from "isoly"

export interface Browser extends CCreatable {
	acceptHeader?: string
	userAgent?: string
	ip?: string 
	country?: isoly.CountryCode.Alpha2
}

export namespace Browser {
	export function is(value: Browser | any): value is Browser {
		return (
			typeof value == "object" &&
			(value.acceptHeader == undefined || typeof value.acceptHeader == "string") &&
			(value.userAgent == undefined || typeof value.userAgent == "string") &&
			(value.ip == undefined || typeof value.ip == "string") &&
			Creatable.is(value)
		)
	}
	export type Creatable = CCreatable
	export namespace Creatable {
		export const is = CCreatable.is
	}
}
