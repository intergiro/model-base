import * as gracely from "gracely"
import { Address } from "../Address"
import { Addresses } from "../Addresses"
import { EmailAddresses } from "../EmailAddresses"
import { IdentityNumber } from "../IdentityNumber"
import { Name } from "../Name"
import { PhoneNumbers } from "../PhoneNumbers"
import { Required as RequiredType } from "./Required"

export interface Customer {
	type?: "organization" | "person"
	identityNumber?: IdentityNumber
	id?: string
	number?: string
	name?: string | Name
	address?: Address | Addresses
	email?: string | EmailAddresses
	phone?: string | PhoneNumbers
}
export namespace Customer {
	export function is(value: any | Customer): value is Customer {
		return (
			typeof value == "object" &&
			(value.type == "organization" || value.type == "person" || value.type == undefined) &&
			(IdentityNumber.is(value.identityNumber) || value.identityNumber == undefined) &&
			(typeof value.id == "string" || value.id == undefined) &&
			(typeof value.number == "string" || value.number == undefined) &&
			(typeof value.name == "string" || Name.is(value.name) || value.name == undefined) &&
			(Address.is(value.address) || Addresses.is(value.address) || value.address == undefined) &&
			(typeof value.email == "string" || EmailAddresses.is(value.email) || value.email == undefined) &&
			(typeof value.phone == "string" || PhoneNumbers.is(value.phone) || value.phone == undefined)
		)
	}
	export function flaw(value: any | Customer): gracely.Flaw {
		return {
			type: "model.Customer",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							value.type == undefined ||
								value.type == "organization" ||
								value.type == "person" || { property: "type", type: '"organization" | "person"' },
							value.identityNumber == undefined ||
								IdentityNumber.is(value.identityNumber) || {
									property: "identityNumber",
									type: "IdentityNumber | undefined",
								},
							value.id == undefined || typeof value.id == "string" || { property: "id", type: "string | undefined" },
							value.number == undefined ||
								typeof value.number == "string" || { property: "number", type: "string | undefined" },
							value.name == undefined ||
								typeof value.name == "string" ||
								Name.is(value.name) || { property: "name", type: "string | Name | undefined" },
							value.address == undefined ||
								Address.is(value.address) ||
								Addresses.is(value.address) || { property: "address", type: "Address | Addresses | undefined" },
							value.email == undefined ||
								typeof value.email == "string" ||
								EmailAddresses.is(value.email) || { property: "email", type: "string | EmailAddresses | undefined" },
							value.phone == undefined ||
								typeof value.phone == "string" ||
								PhoneNumbers.is(value.phone) || { property: "phone", type: "string | PhoneNumbers | undefined" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export function getLabel(customer: Customer | undefined): string | undefined {
		return (
			(customer?.name && Name.get(customer.name)) ??
			EmailAddresses.get(customer?.email) ??
			PhoneNumbers.get(customer?.phone) ??
			customer?.identityNumber ??
			customer?.number ??
			customer?.id ??
			Addresses.get(customer?.address)?.countryCode ??
			customer?.type
		)
	}

	export function getCsvHeaders(): string {
		return `customer type,customer identity number,customer id,customer number`
	}
	export function toCsv(value: Customer | undefined): string {
		let result = ``
		if (!value)
			result += `,,,`
		else {
			result += `"` + value.type + `",`
			result += value.identityNumber ? `"` + value.identityNumber + `",` : `,`
			result += value.id ? `"` + value.id + `",` : `,`
			result += value.number ? `"` + value.number + `"` : ``
		}
		return result
	}
	export type Required = RequiredType
	export namespace Required {
		export const is = RequiredType.is
	}
}
