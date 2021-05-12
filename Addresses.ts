import { Address } from "./Address"

export interface Addresses {
	primary?: Address
	billing?: Address
	delivery?: Address
	visit?: Address
}
export namespace Addresses {
	export type Type = "primary" | "billing" | "delivery" | "visit"
	export const types: ["primary", "billing", "delivery", "visit"] = ["primary", "billing", "delivery", "visit"]
	export function is(value: any | Addresses): value is Addresses {
		return (
			typeof value == "object" &&
			(Address.is(value.primary) || value.primary == undefined) &&
			(Address.is(value.billing) || value.billing == undefined) &&
			(Address.is(value.delivery) || value.delivery == undefined) &&
			(Address.is(value.visit) || value.visit == undefined) &&
			(Address.is(value.primary) || Address.is(value.billing) || Address.is(value.delivery) || Address.is(value.visit))
		)
	}
	export function get(value: Addresses | Address | undefined, ...type: Type[]): Address | undefined {
		let result: Address | undefined
		if (Address.is(value))
			result = value
		else if (Addresses.is(value)) {
			if (type.length == 0)
				type = types
			for (const t of type) {
				switch (t) {
					case "primary":
						result = value.primary
						break
					case "billing":
						result = value.billing
						break
					case "delivery":
						result = value.delivery
						break
					case "visit":
						result = value.visit
						break
				}
				if (result)
					break
			}
		}
		return result
	}
	export function map<T>(addresses: Addresses, mapping: (type: Type, address: Address) => T): T[] {
		return types
			.map<[Type, Address | undefined]>(type => [type, addresses[type]])
			.filter((value): value is [Addresses.Type, Address] => value[1] != undefined)
			.map(v => mapping(v[0], v[1]))
	}
}
