import * as gracely from "gracely"
import * as authly from "authly"

export interface Creatable {
	id?: authly.Identifier
	name: string
	option: authly.Payload.Data
	terms?: string
	logotype?: string
}

export namespace Creatable {
	export function is(value: any | Creatable): value is Creatable {
		return (
			typeof value == "object" &&
			(value.id == undefined || authly.Identifier.is(value.id, 8)) &&
			typeof value.name == "string" &&
			typeof value.option == "object" &&
			(value.terms == undefined || typeof value.terms == "string") &&
			(value.logotype == undefined || typeof value.logotype == "string")
		)
	}
	export function flaw(value: any | Creatable): gracely.Flaw {
		return {
			type: "model.Key.V1.Creatable",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							value.id == undefined ||
								authly.Identifier.is(value.id, 8) || {
									property: "id",
									type: "authly.Identifier | undefined",
									condition: "length == 8",
								},
							typeof value.name == "string" || { property: "name", type: "string" },
							typeof value.option == "object" || { property: "option", type: "authly.Payload.Data" },
							value.terms == undefined ||
								typeof value.terms == "string" || { property: "terms", type: "string | undefined" },
							value.logotype == undefined ||
								typeof value.logotype == "string" || { property: "logotype", type: "string | undefined" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
