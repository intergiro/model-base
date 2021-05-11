export interface DK {
	street: string
	zipCode: string
	city: string
	countryCode: "DK"
}
export namespace DK {
	export function is(value: any | DK): value is DK {
		return (
			typeof value == "object" &&
			typeof value.street == "string" &&
			typeof value.zipCode == "string" &&
			typeof value.city == "string" &&
			value.countryCode == "DK"
		)
	}
	export function create(): DK {
		return { street: "", zipCode: "", city: "", countryCode: "DK" }
	}
}
