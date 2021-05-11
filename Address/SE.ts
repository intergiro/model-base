export interface SE {
	street: string
	zipCode: string
	city: string
	countryCode: "SE"
}
export namespace SE {
	export function is(value: any | SE): value is SE {
		return (
			typeof value == "object" &&
			typeof value.street == "string" &&
			typeof value.zipCode == "string" &&
			typeof value.city == "string" &&
			value.countryCode == "SE"
		)
	}
	export function create(): SE {
		return { street: "", zipCode: "", city: "", countryCode: "SE" }
	}
}
