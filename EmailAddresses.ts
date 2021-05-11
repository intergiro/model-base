export interface EmailAddresses {
	primary?: string
	billing?: string
}
export namespace EmailAddresses {
	export type Type = "primary" | "billing"
	export const types: ["primary", "billing"] = ["primary", "billing"]
	export function is(value: EmailAddresses | any): value is EmailAddresses {
		return (
			typeof value == "object" &&
			(typeof value.primary == "string" || value.primary == undefined) &&
			(typeof value.billing == "string" || value.billing == undefined) &&
			(typeof value.primary == "string" || typeof value.billing == "string")
		)
	}
	export function get(value: EmailAddresses | string | undefined, ...type: Type[]): string | undefined {
		let result: string | undefined
		if (typeof value == "string")
			result = value
		else if (EmailAddresses.is(value)) {
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
				}
				if (result)
					break
			}
		}
		return result
	}
	export function map<T>(addresses: EmailAddresses, mapping: (type: Type, address: string) => T): T[] {
		return types
			.map<[Type, string | undefined]>(type => [type, addresses[type]])
			.filter((value): value is [EmailAddresses.Type, string] => value[1] != undefined)
			.map(v => mapping(v[0], v[1]))
	}
}
