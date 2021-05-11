export interface PhoneNumbers {
	primary?: string
	cellphone?: string
	landline?: string
}
export namespace PhoneNumbers {
	export type Type = "primary" | "cellphone" | "landline"
	export const types: ["primary", "cellphone", "landline"] = ["primary", "cellphone", "landline"]
	export function is(value: PhoneNumbers | any): value is PhoneNumbers {
		return (
			typeof value == "object" &&
			(typeof value.primary == "string" || value.primary == undefined) &&
			(typeof value.cellphone == "string" || value.cellphone == undefined) &&
			(typeof value.landline == "string" || value.landline == undefined) &&
			(value.primary || value.cellphone || value.landline)
		)
	}
	export function get(value: PhoneNumbers | string | undefined, ...type: Type[]): string | undefined {
		let result: string | undefined
		if (typeof value == "string")
			result = value
		else if (PhoneNumbers.is(value)) {
			if (type.length == 0)
				type = types
			for (const t of type) {
				switch (t) {
					case "primary":
						result = value.primary
						break
					case "cellphone":
						result = value.cellphone
						break
					case "landline":
						result = value.landline
						break
				}
				if (result)
					break
			}
		}
		return result
	}
	export function map<T>(numbers: PhoneNumbers, mapping: (type: string, phone: string) => T): T[] {
		return types
			.map<[Type, string | undefined]>(type => [type, numbers[type]])
			.filter((value): value is [PhoneNumbers.Type, string] => value[1] != undefined)
			.map(v => mapping(v[0], v[1]))
	}
}
