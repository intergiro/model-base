import * as isoly from "isoly"
import { Base } from "./Base"

export interface Settle extends Base {
	type: "settle"
	period: {
		start: isoly.Date
		end: isoly.Date
	}
	payout?: isoly.Date
	gross: number
	fee: number
	net: number
	currency: isoly.Currency
	descriptor?: string
	reference: string
}

export namespace Settle {
	export function is(value: Settle | any): value is Settle {
		return (
			Base.is(value) &&
			value.type == "settle" &&
			typeof value.period == "object" &&
			isoly.Date.is(value.period.start) &&
			isoly.Date.is(value.period.end) &&
			(value.payout == undefined || isoly.Date.is(value.payout)) &&
			typeof value.gross == "number" &&
			typeof value.net == "number" &&
			typeof value.fee == "number" &&
			isoly.Currency.is(value.currency) &&
			(value.descriptor == undefined || typeof value.descriptor == "string") &&
			typeof value.reference == "string"
		)
	}
	export function merge(array: Settle[]): Settle {
		return array.reduce<Settle>((r, c) => {
			return { ...c, gross: (r.gross ?? 0) + c.gross, fee: (r.fee ?? 0) + c.fee, net: (r.net ?? 0) + c.net }
		}, {} as Settle)
	}
}
