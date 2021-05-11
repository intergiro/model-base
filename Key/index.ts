import * as Actors from "./Actors"
import { Audience as KeyAudience } from "./Audience"
import { Creatable as KeyCreatable } from "./Creatable"
import { Email as KeyEmail } from "./Email"
import { Key as KKey } from "./Key"
import { Mash as KeyMash } from "./Mash"
import { Sms as KeySms } from "./Sms"

export type Key = KKey
export namespace Key {
	export const is = KKey.is
	export const unpack = Actors.unpack
	export const getVerifier = Actors.getVerifier
	export const getIssuer = Actors.getIssuer

	export type Agent = KKey.Agent
	export namespace Agent {
		export const is = KKey.Agent.is
	}
	export type Audience = KeyAudience
	export namespace Audience {
		export const is = KeyAudience.is
	}

	export type Creatable = KeyCreatable
	export namespace Creatable {
		export const is = KeyCreatable.is
		export const flaw = KeyCreatable.flaw
	}
	export type Email = KeyEmail
	export namespace Email {
		export const is = KeyEmail.is
		export const flaw = KeyEmail.flaw
	}
	export type Mash = KeyMash
	export namespace Mash {
		export const is = KeyMash.is
		export const flaw = KeyMash.flaw
	}
	export type Sms = KeySms
	export namespace Sms {
		export const is = KeySms.is
		export const flaw = KeySms.flaw
	}
}
