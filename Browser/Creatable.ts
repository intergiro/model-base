import * as isoly from "isoly"

export interface Creatable {
	colorDepth?: number
	java?: boolean
	javascript?: boolean
	locale?: isoly.Locale
	timezone?: number
	resolution?: [number, number]
	parent?: string
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return (
			typeof value == "object" &&
			(value.colorDepth == undefined || typeof value.colorDepth == "number") &&
			(value.java == undefined || typeof value.java == "boolean") &&
			(value.javascript == undefined || typeof value.javascript == "boolean") &&
			(value.locale == undefined || isoly.Locale.is(value.locale)) &&
			(value.timezone == undefined || typeof value.timezone == "number") &&
			(value.resolution == undefined ||
				(Array.isArray(value.resolution) &&
					value.resolution.length == 2 &&
					value.resolution.every((v: any) => typeof v == "number"))) &&
			(value.parent == undefined || typeof value.parent == "string")
		)
	}
}
