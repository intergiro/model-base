export type Type =
	| 0 // person
	| 1 // decedent estate
	| 2 // goverment, church
	| 3 // foreign business
	| 5 // limited company
	| 6 // partnership
	| 7 // cooperative, housing cooperative
	| 8 // nonprofit, foundation
	| 9 // trading partnership, limited partnership, partnership

export namespace Type {
	export function is(value: any | Type): value is Type {
		return (
			typeof value == "number" &&
			(value == 0 ||
				value == 1 ||
				value == 2 ||
				value == 3 ||
				value == 5 ||
				value == 6 ||
				value == 7 ||
				value == 8 ||
				value == 9)
		)
	}
	export function parse(value: string): Type | undefined {
		const v = parseInt(value)
		return is(v) ? v : undefined
	}
}
