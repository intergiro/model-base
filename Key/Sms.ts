import * as gracely from "gracely"

export interface Sms {
	key?: string
	sender?: string
	dryRun?: "true" // Problems signing if property is of type boolean
}

export namespace Sms {
	export function is(value: any | Sms): value is Sms {
		return (
			typeof value == "object" &&
			(value.key == undefined || typeof value.key == "string") &&
			(value.sender == undefined || typeof value.sender == "string") &&
			(value.dryRun == undefined || value.dryRun == "true")
		)
	}
	export function flaw(value: any | Sms): gracely.Flaw {
		return {
			type: "model.Key.Sms",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							typeof value.key == "string" || { property: "key", type: "string" },
							value.sender == undefined ||
								typeof value.sender == "string" || { property: "sender", type: "string | undefined" },
							value.dryRun == undefined || value.dryRun == "true" || { property: "dryRun", type: '"true" | undefined' },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
