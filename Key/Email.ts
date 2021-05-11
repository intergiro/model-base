import * as gracely from "gracely"

export interface Email {
	key?: string
	notify?: string
}

export namespace Email {
	export function is(value: any | Email): value is Email {
		return (
			typeof value == "object" &&
			(value.key == undefined || typeof value.key == "string") &&
			(value.notify == undefined || typeof value.notify == "string")
		)
	}
	export function flaw(value: any | Email): gracely.Flaw {
		return {
			type: "model.Key.Email",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							typeof value.key == "string" || { property: "key", type: "string" },
							value.notify == undefined ||
								typeof value.notify == "string" || { property: "notify", type: "string | undefined" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
