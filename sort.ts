import * as isoly from "isoly"

export function sort<T>(value: T[], property: "created"): T[] {
	return value.sort(getComparer(property))
}
export function getComparer<T>(property: "created"): (left: T, right: T) => number {
	let result: (left: T, right: T) => number
	switch (property) {
		case "created":
		default:
			result = (
				left: T & { created: isoly.Date | isoly.DateTime },
				right: T & { created: isoly.Date | isoly.DateTime }
			) => (left.created < right.created ? 1 : left.created > right.created ? -1 : 0)
			break
	}
	return result
}
