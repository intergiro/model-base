import * as gracely from "gracely"
import * as authly from "authly"
import { Key } from "./Key"

export interface Merchant {
	id: authly.Identifier
	name: string
	agent?: authly.Identifier
	key: {
		private: authly.Token
		public?: authly.Token
	}
	logotype?: string
	terms?: string
}

export namespace Merchant {
	export function is(value: any | Merchant): value is Merchant {
		return (
			typeof value == "object" &&
			authly.Identifier.is((value as any).id) &&
			typeof value.name == "string" &&
			(value.agent == undefined || authly.Identifier.is(value.agent)) &&
			typeof value.key == "object" &&
			authly.Token.is(value.key.private) &&
			(value.key.public == undefined || authly.Token.is(value.key.public)) &&
			(value.logotype == undefined || typeof value.logotype == "string") &&
			(value.terms == undefined || typeof value.terms == "string")
		)
	}
	export function flaw(value: any | Merchant): gracely.Flaw {
		return {
			type: "model.Merchant",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							authly.Identifier.is(value.id, 8) || {
								property: "id",
								type: "authly.Identifier",
								condition: "length == 8",
							},
							typeof value.name == "string" || { property: "name", type: "string" },
							(typeof value.key == "object" &&
								(value.key.public == undefined || authly.Token.is(value.key.public)) &&
								authly.Token.is(value.key.private)) || {
								property: "key",
								type: "{ public: authly.Token | undefined, private: authly.Token }",
							},
							value.terms == undefined ||
								typeof value.terms == "string" || { property: "terms", type: "string | undefined" },
							value.logotype == undefined ||
								typeof value.logotype == "string" || { property: "logotype", type: "string | undefined" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export type Creatable = Key.Creatable
	export namespace Creatable {
		export const is = Key.Creatable.is
		export const flaw = Key.Creatable.flaw
	}
}
