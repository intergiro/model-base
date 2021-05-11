import * as flagly from "flagly"
import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import { Audience } from "./Audience"
import { Card } from "./Card"
import { Creatable } from "./Creatable"
import { Email } from "./Email"
import { Mash } from "./Mash"
import { Sms } from "./Sms"
import { V1 as V1Key } from "./V1"

export interface Key extends Creatable {
	sub: authly.Identifier
	account?: authly.Identifier
	aud: Audience | Audience[]
	iss: string
	iat: number
	exp?: number
	user?: string
	currency?: isoly.Currency
	language?: isoly.Language
	notice?: string
	features?: flagly.Flags
	token: authly.Token
	card?: Card
}

export namespace Key {
	export function is(value: Key | any): value is Key {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.sub) &&
			(value.account == undefined || authly.Identifier.is(value.account, 16)) &&
			(Audience.is(value.aud) || (Array.isArray(value.aud) && value.aud.every(Audience.is))) &&
			typeof value.iss == "string" &&
			typeof value.iat == "number" &&
			(value.exp == undefined || typeof value.exp == "number") &&
			(value.user == undefined || typeof value.user == "string") &&
			(value.currency == undefined || isoly.Currency.is(value.currency)) &&
			(value.language == undefined || isoly.Language.is(value.language)) &&
			(value.notice == undefined || typeof value.notice == "string") &&
			(value.features == undefined || flagly.Flags.is(value.features)) &&
			(value.token == undefined || authly.Token.is(value.token)) &&
			Creatable.is(value)
		)
	}
	export function flaw(value: any | Creatable): gracely.Flaw {
		return {
			type: "model.Key.Creatable",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							authly.Identifier.is(value.sub) || {
								property: "sub",
								type: "authly.Identifier | undefined",
							},
							Audience.is(value.aud) ||
								(Array.isArray(value.aud) && value.aud.every(Audience.is)) || {
									property: "aud",
									type: "model.Key.Audience | model.Key.Audience[]",
								},
							value.account == undefined ||
								authly.Identifier.is(value.account, 16) || {
									property: "account",
									type: "identifier",
									condition: "Length = 8",
								},
							typeof value.iss == "string" || { property: "iss", type: "string" },
							typeof value.iat == "number" || { property: "iat", type: "number" },
							value.exp == undefined || typeof value.exp == "number" || { property: "exp", type: "undefined | number" },
							value.user == undefined ||
								typeof value.user == "string" || { property: "user", type: "string | undefined" },
							value.currency == undefined ||
								isoly.Currency.is(value.currency) || { property: "currency", type: "isoly.Currency | undefined" },
							value.language == undefined ||
								isoly.Language.is(value.language) || { property: "language", type: "isoly.Language | undefined" },
							value.notice == undefined ||
								typeof value.notice == "string" || { property: "notice", type: "string | undefined" },
							...(Creatable.flaw(value).flaws || []),
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}

	export async function upgrade(
		key: Key | V1Key | undefined,
		cardVerifier?: authly.Verifier<{ card: Card; url: string }> | undefined
	): Promise<Key | undefined> {
		let result: Key | undefined
		if (key == undefined)
			result = undefined
		else if (is(key))
			result = key
		else {
			result = {
				sub: key.sub,
				iss: key.iss,
				aud: typeof key.aud == "string" ? key.aud : "private",
				iat: key.iat,
				name: key.name,
				url: "",
				features: key.features as any,
				token: key.token as any,
			}
			if (typeof key.option.card == "string") {
				const unpacked = await cardVerifier?.verify(
					key.option.card,
					...(Array.isArray(result.aud) ? result.aud : [result.aud])
				)
				result = unpacked
					? {
							...result,
							card: unpacked.card,
							url: unpacked.url,
					  }
					: undefined
			}
			if (result && key.option.email)
				(result as any) = Email.is(key.option.email) ? { ...result, email: key.option.email } : undefined
			if (result && key.option.mash)
				(result as any) = Mash.is(key.option.mash) ? { ...result, mash: key.option.mash } : undefined
			if (result && key.option.sms)
				(result as any) = Sms.is(key.option.sms) ? { ...result, sms: key.option.sms } : undefined
			if (result && key.option.currency)
				result = isoly.Currency.is(key.option.currency) ? { ...result, currency: key.option.currency } : undefined
		}
		return result
	}

	export type Agent = Omit<Key, "card"> & { card?: Card.Creatable }
	export namespace Agent {
		export function is(value: Agent | any): value is Agent {
			return (
				typeof value == "object" &&
				(value.card == undefined || Card.Creatable.is(value.card)) &&
				Key.is({ ...value, card: undefined })
			)
		}
	}
}
