import * as gracely from "gracely"
import { Base as UserBase } from "./Base"

export interface Creatable extends UserBase {
	password: string | { property: string; type: string }
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return (
			typeof value == "object" &&
			(typeof value.password == "string" || typeof value.password == "object") &&
			UserBase.is(value)
		)
	}
	export function flaw(value: Creatable | any): gracely.Flaw {
		return {
			type: "model.User.Creatable",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							typeof value.password == "string" ||
								typeof value.password == "object" || { property: "password", type: "string | object" },
							UserBase.is(value) || { ...UserBase.flaw(value).flaws },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
