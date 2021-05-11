import { Event } from "./Event"

export type Status =
	| "created"
	| "deferred"
	| "pending"
	| "denied"
	| "ordered"
	| "cancelled"
	| "charged"
	| "paid"
	| "refunded"
	| "settled"
	| "synchronized"

export namespace Status {
	export const types: Status[] = [
		"created",
		"deferred",
		"pending",
		"denied",
		"ordered",
		"cancelled",
		"charged",
		"paid",
		"refunded",
		"settled",
		"synchronized",
	]
	export function is(value: any | Status): value is Status {
		return typeof value == "string" && types.some(t => t == value)
	}
	export function sort(statuses: Status[]): Status[] {
		return statuses.sort((left, right) => types.indexOf(left) - types.indexOf(right))
	}
	export function change(from: Status, event: Event.Type): Status | undefined {
		let result: Status | undefined
		switch (event) {
			case "defer":
				result = from == "synchronized" || from == "created" || from == "pending" ? "deferred" : undefined
				break
			case "pend":
				result = from == "synchronized" || from == "created" || from == "deferred" ? "pending" : undefined
				break
			case "deny":
				result =
					from == "synchronized" || from == "created" || from == "deferred" || from == "pending" ? "denied" : undefined
				break
			case "order":
				result =
					from == "synchronized" || from == "created" || from == "deferred" || from == "pending" ? "ordered" : undefined
				break
			case "cancel":
				result =
					from == "synchronized" || from == "created" || from == "deferred" || from == "pending" || from == "ordered"
						? "cancelled"
						: undefined
				break
			case "charge":
				result = from == "synchronized" || from == "ordered" ? "charged" : undefined
				break
			case "pay":
				result = from == "synchronized" || from == "charged" ? "paid" : undefined
				break
			case "refund":
				result = from == "synchronized" || from == "charged" || from == "paid" ? "refunded" : undefined
				break
			case "synchronize":
				result = "synchronized"
				break
			case "settle":
				result = from == "charged" || from == "refunded" || from == "settled" ? "settled" : undefined
				break
			default:
			case "fail":
				result = from
				break
		}
		return result
	}
	export function fromEvent(type: Event.Type): Status {
		let result: Status
		switch (type) {
			default:
			case "fail":
				result = "created"
				break
			case "defer":
				result = "deferred"
				break
			case "pend":
				result = "pending"
				break
			case "deny":
				result = "denied"
				break
			case "order":
				result = "ordered"
				break
			case "cancel":
				result = "cancelled"
				break
			case "charge":
				result = "charged"
				break
			case "pay":
				result = "paid"
				break
			case "refund":
				result = "refunded"
				break
			case "settle":
				result = "settled"
				break
			case "synchronize":
				result = "synchronized"
				break
		}
		return result
	}
	export function toEvent(status: Status): Event.Type {
		let result: Event.Type
		switch (status) {
			default:
			case "created":
				result = "fail"
				break
			case "deferred":
				result = "defer"
				break
			case "pending":
				result = "pend"
				break
			case "denied":
				result = "deny"
				break
			case "ordered":
				result = "order"
				break
			case "cancelled":
				result = "cancel"
				break
			case "charged":
				result = "charge"
				break
			case "paid":
				result = "pay"
				break
			case "refunded":
				result = "refund"
				break
			case "settled":
				result = "settle"
				break
			case "synchronized":
				result = "synchronize"
				break
		}
		return result
	}
}
