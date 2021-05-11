import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import { Acquirer } from "../../Acquirer"
import { CategoryCode } from "./../CategoryCode"
import { Emv3d } from "./../Emv3d"
import { Creatable as CardCreatable } from "./Creatable"

export interface Card {
	descriptor?: string
	country: isoly.CountryCode.Alpha2
	acquirer: Acquirer
	mid?: string
	mcc?: CategoryCode
	emv3d?: Emv3d
	url: string
	id?: string
}
export namespace Card {
	export function is(value: Card | any): value is Card {
		return (
			typeof value == "object" &&
			(value.descriptor == undefined || typeof value.descriptor == "string") &&
			isoly.CountryCode.Alpha2.is(value.country) &&
			Acquirer.is(value.acquirer) &&
			(value.mid == undefined || typeof value.mid == "string") &&
			(value.mcc == undefined || CategoryCode.is(value.mcc)) &&
			(value.emv3d == undefined || Emv3d.is(value.emv3d)) &&
			(value.url == undefined || typeof value.url == "string") &&
			(value.id == undefined || authly.Identifier.is(value.id))
		)
	}
	export function flaw(value: any | Card): gracely.Flaw {
		return {
			type: "model.Merchant.Card",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							value.descriptor == undefined ||
								typeof value.descriptor == "string" || { property: "descriptor", type: "string | undefined" },
							isoly.CountryCode.Alpha2.is(value.country) || { property: "country", type: "isoly.CountryCode" },
							Acquirer.is(value.acquirer) || { property: "acquirer", type: "model.Acquirer" },
							value.mid == undefined || typeof value.mid == "string" || { property: "mid", type: "string | undefined" },
							value.mcc == undefined ||
								CategoryCode.is(value.mcc) || { property: "mcc", type: "model.Merchant.CategoryCode | undefined" },
							value.emv3d == undefined || Emv3d.is(value.emv3d) || { property: "emv3d", ...Emv3d.flaw(value.emv3d) },
							typeof value.url == "string" || { property: "url", type: "string" },
							value.id == undefined ||
								authly.Identifier.is(value.id) || { property: "id", type: "authly.Identifier | undefined" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export type Creatable = CardCreatable
	export namespace Creatable {
		export const is = CardCreatable.is
		export const flaw = CardCreatable.flaw
	}
}
