import * as gracely from "gracely"
import * as authly from "authly"
import { Base as UserBase } from "./Base"
import { Creatable as UserCreatable } from "./Creatable"

export interface User extends UserBase {
	id: authly.Identifier
}

export namespace User {
	export function is(value: any | User): value is User {
		return typeof value == "object" && authly.Identifier.is(value.id, 8) && UserBase.is(value)
	}
	export function flaw(value: any | User): gracely.Flaw {
		return {
			type: "model.User",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							authly.Identifier.is(value.id, 8) || { property: "id", type: "string", condition: "length == 8" },
							UserBase.is(value) || { ...UserBase.flaw(value).flaws },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export function generateId(): authly.Identifier {
		return authly.Identifier.generate(8)
	}
	export type Base = UserBase
	export namespace Base {
		export const is = UserBase.is
		export const flaw = UserBase.flaw
	}
	export type Creatable = UserCreatable
	export namespace Creatable {
		export const is = UserCreatable.is
		export const flaw = UserCreatable.flaw
	}
}
