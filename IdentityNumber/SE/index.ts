import { Type } from "./Type"

export type SE = string
// https://sv.wikipedia.org/wiki/Personnummer_i_Sverige
// https://sv.wikipedia.org/wiki/Organisationsnummer
export namespace SE {
	export function is(value: any | SE): value is SE {
		return typeof value == "string" && /^(16|18|19|20)?\d{10}$/.test(value) && verifyChecksum(value)
	}
	export function is10(value: any | SE): value is SE {
		return typeof value == "string" && /\d{10}$/.test(value)
	}
	export function is12(value: any | SE): value is SE {
		return typeof value == "string" && /^(16|18|19|20)\d{10}$/.test(value)
	}
	export function as10(value: SE): SE {
		return is12(value) ? value.substring(2) : value
	}
	export function isOrganisation(value: SE): boolean {
		return as10(value)[2] > "1"
	}
	export function isTemporary(value: SE): boolean {
		return !isOrganisation(value) && as10(value)[4] > "5"
	}
	export function type(value: SE): Type {
		value = as10(value)
		return isOrganisation(value) ? Type.parse(value[0]) || 0 : 0
	}
	export function parse(value: string): SE | undefined {
		return /^(16|18|19|20)?(\d{6}([-+]|\s)\d{4})$/.test(value)
			? value.substring(0, value.length - 5) + value.substring(value.length - 4)
			: SE.is(value)
			? value
			: undefined
	}
	export function format(value: SE): string {
		return value.substring(0, value.length - 4) + "-" + value.substring(value.length - 4)
	}
	export function calculateChecksum(value: SE): number {
		value = as10(value)
		let sum = 0
		let index = 0
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const v = Number.parseInt(value[index++]) * 2
			sum += v < 10 ? v : 1 + v - 10
			if (index >= 9)
				break
			sum += Number.parseInt(value[index++])
		}
		return (10 - (sum % 10)) % 10
	}
	export function verifyChecksum(value: SE): boolean {
		value = as10(value)
		return Number.parseInt(value[9]) == calculateChecksum(value)
	}
}
