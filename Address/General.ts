import { CountryCode } from "isoly"

export interface General {
	address1?: string
	address2?: string
	address3?: string
	street?: string
	zipCode?: string
	city?: string
	state?: string
	countryCode: CountryCode.Alpha2 | ""
}
export namespace General {
	export function is(value: any | General): value is General {
		return (
			typeof value == "object" &&
			(typeof value.address1 == "string" || value.address1 == undefined) &&
			(typeof value.address2 == "string" || value.address2 == undefined) &&
			(typeof value.address3 == "string" || value.address3 == undefined) &&
			(typeof value.street == "string" || value.street == undefined) &&
			(typeof value.zipCode == "string" || value.zipCode == undefined) &&
			(typeof value.city == "string" || value.city == undefined) &&
			(typeof value.state == "string" || value.state == undefined) &&
			(CountryCode.Alpha2.is(value.countryCode) || value.countryCode == "")
		)
	}
	export function create(): General {
		return { countryCode: "" }
	}
}
