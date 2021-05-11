import * as gracely from "gracely"
import * as authly from "authly"
import * as card from "@payfunc/model-card"
import { Email } from "./Email"
import { Mash } from "./Mash"
import { Sms } from "./Sms"
import { V1 as V1Key } from "./V1"

export interface Creatable {
	sub?: authly.Identifier
	id?: authly.Identifier
	name: string

	type?: "live" | "demo" | "test"
	agent?: string

	url?: string
	terms?: string
	logotype?: string

	card?: card.Merchant.Card.Creatable
	email?: Email
	mash?: Mash
	sms?: Sms
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return (
			typeof value == "object" &&
			(value.sub == undefined || authly.Identifier.is(value.sub)) &&
			(value.id == undefined || authly.Identifier.is(value.id)) &&
			typeof value.name == "string" &&
			(value.type == undefined || value.type == "live" || value.type == "demo" || value.type == "test") &&
			(value.agent == undefined || typeof value.agent == "string") &&
			(value.url == undefined || typeof value.url == "string") &&
			(value.terms == undefined || typeof value.terms == "string") &&
			(value.logotype == undefined || typeof value.logotype == "string") &&
			(value.card == undefined || card.Merchant.Card.Creatable.is(value.card)) &&
			(value.email == undefined || Email.is(value.email)) &&
			(value.mash == undefined || Mash.is(value.mash)) &&
			(value.sms == undefined || Sms.is(value.sms)) &&
			value.option == undefined // Fail V1 Keys
		)
	}
	export function flaw(value: any | Creatable): gracely.Flaw {
		return {
			type: "model.Key.Creatable",
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
							value.terms == undefined ||
								typeof value.terms == "string" || { property: "terms", type: "string | undefined" },
							value.logotype == undefined ||
								typeof value.logotype == "string" || { property: "logotype", type: "string | undefined" },
							typeof value.url == "string" || value.url == undefined || { property: "url", type: "string | undefined" },
							value.card == undefined ||
								card.Merchant.Card.Creatable.is(value.card) || {
									property: "card",
									...card.Merchant.Card.Creatable.flaw(value.card),
								},
							value.email == undefined || Email.is(value.email) || { property: "email", ...Email.flaw(value.email) },
							value.mash == undefined || Mash.is(value.mash) || { property: "mash", ...Mash.flaw(value.mash) },
							value.sms == undefined || Sms.is(value.sms) || { property: "sms", ...Sms.flaw(value.sms) },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export function upgrade(value: V1Key.Creatable): Creatable | undefined {
		let result: Creatable | undefined
		let failed = false
		if (!Object.keys(value.option).find(key => key != "card" && key != "email" && key != "mash" && key != "sms")) {
			const input = { ...value, url: "" }
			const option = input.option
			if (
				!(
					(option.card && !card.Merchant.Card.Creatable.is(option.card)) ||
					(option.email && !Email.is(option.email)) ||
					(option.mash && !Mash.is(option.mash)) ||
					(option.sms && !Sms.is(option.sms))
				)
			) {
				delete (input as any).option
				result = input
				if (option.card) {
					if (!card.Merchant.Card.Creatable.is(option.card))
						failed = true
					else
						result = { ...result, card: option.card, url: option.card.url }
				}
				if (option.email) {
					if (!Email.is(option.email))
						failed = true
					else
						result = { ...result, email: option.email }
				}
				if (option.mash) {
					if (!Mash.is(option.mash))
						failed = true
					else
						result = { ...result, mash: option.mash }
				}
				if (option.sms) {
					if (!Sms.is(option.sms))
						failed = true
					else
						result = { ...result, sms: option.sms }
				}
				if (failed)
					result = undefined
			}
		}
		return result
	}
}
