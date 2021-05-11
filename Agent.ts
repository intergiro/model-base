import * as gracely from "gracely"
import * as authly from "authly"
import { Key } from "./Key"

export interface Agent {
	id: authly.Identifier
	name: string
	key: authly.Token
	logotype?: string
	terms?: string
}

export namespace Agent {
	export function is(value: any | Agent): value is Agent {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.id) &&
			typeof value.name == "string" &&
			authly.Token.is(value.key) &&
			(value.logotype == undefined || typeof value.logotype == "string") &&
			(value.terms == undefined || typeof value.terms == "string")
		)
	}
	export function flaw(value: any | Agent): gracely.Flaw {
		return {
			type: "model.Agent",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							authly.Identifier.is(value.id) || {
								property: "id",
								type: "authly.Identifier",
							},
							typeof value.name == "string" || { property: "name", type: "string" },
							authly.Token.is(value.key) || {
								property: "key",
								type: "authly.Token",
							},
							value.terms == undefined ||
								typeof value.terms == "string" || { property: "terms", type: "string | undefined" },
							value.logotype == undefined ||
								typeof value.logotype == "string" || { property: "logotype", type: "string | undefined" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}

	export function createMerchant(agent: Key.Agent, creatable: Key.Creatable): Key | undefined {
		const result = merge({ ...agent }, { ...creatable })
		return Key.is(result) ? result : undefined
	}

	export function merge(target: authly.Payload, source: authly.Payload): authly.Payload {
		const result = target
		for (const key in source) {
			if (source[key])
				if (
					target[key] &&
					!Array.isArray(target[key]) &&
					typeof target[key] == "object" &&
					!Array.isArray(source[key]) &&
					typeof source[key] == "object"
				)
					merge(target[key] as authly.Payload, source[key] as authly.Payload)
				else
					result[key] = source[key]
		}
		return result
	}
}
