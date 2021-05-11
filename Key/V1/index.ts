import * as gracely from "gracely"
import * as authly from "authly"
import { Audience as V1Audience } from "./Audience"
import { Creatable as V1Creatable } from "./Creatable"

export interface V1 extends V1Creatable, authly.Payload {
	sub: string
	iss: string
	aud: V1Audience
	iat: number
	user?: string
	option: authly.Payload.Data
}

export namespace V1 {
	export function is(value: V1 | any): value is V1 {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.sub, 8) &&
			typeof value.iss == "string" &&
			V1Audience.is(value.aud) &&
			typeof value.iat == "number" &&
			(value.user == undefined || typeof value.user == "string") &&
			typeof value.option == "object" &&
			V1Creatable.is({ ...value, id: value.sub })
		)
	}
	export function flaw(value: any | V1): gracely.Flaw {
		return {
			type: "model.Key.V1",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							typeof value.sub == "string" || {
								property: "sub",
								type: "authly.Identifier",
								condition: "Merchant identifier.",
							},
							typeof value.iss == "string" || { property: "iss", type: "string", condition: "Key issuer." },
							V1Audience.is((value as any).aud) || {
								property: "aud",
								type: `"private" | "public" | ["private", "public"]`,
								condition: "Key audience.",
							},
							typeof value.iat == "number" || { property: "iat", type: "number", condition: "Issued timestamp." },
							value.user == undefined ||
								typeof value.user == "string" || {
									property: "user",
									type: "string | undefined",
									condition: "User email for which the token is issued.",
								},
							...(V1Creatable.flaw(value).flaws || []),
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export async function unpack(key: authly.Token): Promise<V1 | undefined> {
		const payload: authly.Payload | undefined = await authly.Verifier.create().verify(key, "public")
		return is(payload) ? payload : undefined
	}

	export type Creatable = V1Creatable
	export namespace Creatable {
		export const is = V1Creatable.is
		export const flaw = V1Creatable.flaw
	}

	export type Audience = V1Audience
	export namespace Audience {
		export const is = V1Audience.is
	}
}
