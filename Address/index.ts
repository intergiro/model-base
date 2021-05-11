import { CountryCode } from "isoly"
import { DE as AddressDE } from "./DE"
import { DK as AddressDK } from "./DK"
import { FI as AddressFI } from "./FI"
import { General as AddressGeneral } from "./General"
import { NO as AddressNO } from "./NO"
import { SE as AddressSE } from "./SE"

export type Address = AddressDE | AddressDK | AddressFI | AddressNO | AddressSE | AddressGeneral
export namespace Address {
	export function is(value: any | Address): value is Address {
		return (
			typeof value == "object" &&
			(CountryCode.Alpha2.is(value.countryCode) || value.countryCode == "") &&
			((value.countryCode == "DE" && AddressDE.is(value)) ||
				(value.countryCode == "DK" && AddressDK.is(value)) ||
				(value.countryCode == "FI" && AddressFI.is(value)) ||
				(value.countryCode == "NO" && AddressNO.is(value)) ||
				(value.countryCode == "SE" && AddressSE.is(value)) ||
				AddressGeneral.is(value))
		)
	}
	export function create(countryCode: CountryCode.Alpha2 | string): Address {
		let result: Address
		switch (countryCode) {
			case "DE":
				result = AddressDE.create()
				break
			case "DK":
				result = AddressDK.create()
				break
			case "FI":
				result = AddressFI.create()
				break
			case "NO":
				result = AddressNO.create()
				break
			case "SE":
				result = AddressSE.create()
				break
			default:
				result = AddressGeneral.create()
				break
		}
		return result
	}
	export type DE = AddressDE
	export namespace DE {
		export const is = AddressDE.is
		export const create = AddressDE.create
		export const State = AddressDE.State
	}
	export type DK = AddressDK
	export namespace DK {
		export const is = AddressDK.is
		export const create = AddressDK.create
	}
	export type FI = AddressFI
	export namespace FI {
		export const is = AddressFI.is
		export const create = AddressFI.create
	}
	export type NO = AddressNO
	export namespace NO {
		export const is = AddressNO.is
		export const create = AddressNO.create
	}
	export type SE = AddressSE
	export namespace SE {
		export const is = AddressSE.is
		export const create = AddressSE.create
	}
	export type General = AddressGeneral
	export namespace General {
		export const is = AddressGeneral.is
		export const create = AddressGeneral.create
	}
}
