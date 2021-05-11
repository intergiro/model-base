import * as gracely from "gracely"
import { Merchant } from "../Merchant"

export interface Base {
	email: string
	merchant: Merchant | Merchant[]
	option: { [key: string]: any }
}

export namespace Base {
	export function is(value: Base | any): value is Base {
		return (
			typeof value == "object" &&
			typeof value.email == "string" &&
			(Merchant.is(value.merchant) || (Array.isArray(value.merchant) && value.merchant.every(Merchant.is))) &&
			typeof value.option == "object"
		)
	}
	export function flaw(value: Base | any): gracely.Flaw {
		return {
			type: "model.User.Base",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							typeof value.email == "string" || { property: "email", type: "string" },
							Merchant.is(value.merchant) ||
								(Array.isArray(value.merchant) && value.merchant.every(Merchant.is)) || {
									property: "merchant",
									type: "Merchant | Merchant[]",
								},
							typeof value.option == "object" || { property: "option", type: "{ [key: string]: any }" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
