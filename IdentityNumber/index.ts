import * as isoly from "isoly"
import { SE as IdentityNumberSE } from "./SE"

export type IdentityNumber = IdentityNumberSE

export namespace IdentityNumber {
	export function is(value: any | IdentityNumber, countryCode?: isoly.CountryCode.Alpha2): value is IdentityNumber {
		return (
			(countryCode == "SE" && IdentityNumberSE.is(value)) || (countryCode == undefined && IdentityNumberSE.is(value))
		)
	}
	export type SE = IdentityNumberSE
	export namespace SE {
		export const is = IdentityNumberSE.is
		export const is10 = IdentityNumberSE.is10
		export const is12 = IdentityNumberSE.is12
		export const as10 = IdentityNumberSE.as10
		export const isOrganisation = IdentityNumberSE.isOrganisation
		export const isTemporary = IdentityNumberSE.isTemporary
		export const type = IdentityNumberSE.type
		export const parse = IdentityNumberSE.parse
		export const format = IdentityNumberSE.format
		export const calculateChecksum = IdentityNumberSE.calculateChecksum
		export const verifyChecksum = IdentityNumberSE.verifyChecksum
	}
}
