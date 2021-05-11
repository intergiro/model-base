export interface NO {
	street: string
	zipCode: string
	city: string
	countryCode: "NO"
}
export namespace NO {
	export function is(value: any | NO): value is NO {
		return (
			typeof value == "object" &&
			typeof value.street == "string" &&
			typeof value.zipCode == "string" &&
			typeof value.city == "string" &&
			value.countryCode == "NO"
		)
	}
	export function create(): NO {
		return { street: "", zipCode: "", city: "", countryCode: "NO" }
	}
}
