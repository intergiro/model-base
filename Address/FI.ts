export interface FI {
	street: string
	zipCode: string
	city: string
	countryCode: "FI"
}
export namespace FI {
	export function is(value: any | FI): value is FI {
		return (
			typeof value == "object" &&
			typeof value.street == "string" &&
			typeof value.zipCode == "string" &&
			typeof value.city == "string" &&
			value.countryCode == "FI"
		)
	}
	export function create(): FI {
		return { street: "", zipCode: "", city: "", countryCode: "FI" }
	}
}
