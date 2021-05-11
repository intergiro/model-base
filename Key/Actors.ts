import * as flagly from "flagly"
import * as authly from "authly"
// import * as card from "@payfunc/model-card"
import { Audience } from "./Audience"
import { Key } from "./Key"
import { V1 } from "./V1"

export function getVerifier(
	secrets?: {
		signing: string
		property: string
		signingV1?: string
		propertyV1?: string
	},
	guard?: "merchant"
): authly.Verifier<Key>
export function getVerifier(
	secrets?: {
		signing: string
		property: string
		signingV1?: string
		propertyV1?: string
	},
	guard?: "agent"
): authly.Verifier<Key.Agent>
export function getVerifier(
	secrets?: {
		signing: string
		property: string
		signingV1?: string
		propertyV1?: string
	},
	guard?: "agent" | "merchant"
): authly.Verifier<Key | Key.Agent> {
	const algorithm: authly.Algorithm[] = secrets
		? secrets.signingV1
			? [authly.Algorithm.create("HS256", secrets.signing), authly.Algorithm.create("HS256", secrets.signingV1)]
			: [authly.Algorithm.create("HS256", secrets.signing)]
		: []
	return authly.Verifier.create<Key | Key.Agent>(...algorithm).add(
		guard == "merchant"
			? new authly.Property.Typeguard<Key>(Key.is)
			: guard == "agent"
			? new authly.Property.Typeguard<Key.Agent>(Key.Agent.is)
			: undefined,
		...getVerifierTransformations(algorithm, secrets?.property, secrets?.propertyV1)
	)
}
function getVerifierTransformations(
	algorithm: authly.Algorithm[],
	secret?: string,
	secretV1?: string
): authly.Property.Transformer[] {
	const legacyCrypto = authly.Property.Crypto.create(secretV1, "acquirer", "emv3d")
	return [
		authly.Property.Transformer.create({
			reverse: async (oldKey: V1 | authly.Payload) => {
				let result: Key | authly.Payload | undefined = oldKey
				if (V1.is(oldKey)) {
					result = await Key.upgrade(
						oldKey,
						authly.Token.is(oldKey.option.card) ? getCardVerifier(legacyCrypto, ...algorithm) : undefined
					)
				}
				return result
			},
		}),
		authly.Property.Crypto.create(
			secret,
			"mash",
			"sms",
			"email",
			"option.mash",
			"option.sms",
			"option.email",
			"card.acquirer",
			"card.emv3d"
		),
		featuresTransformer,
	].filter(authly.Property.Transformer.is)
}

export function getIssuer(
	secrets: {
		signing: string
		property: string
	},
	guard?: "merchant"
): authly.Issuer<Omit<Key, "iat" | "token">>
export function getIssuer(
	secrets: {
		signing: string
		property: string
	},
	guard?: "agent"
): authly.Issuer<Omit<Key.Agent, "iat" | "token">>
export function getIssuer(
	secrets: {
		signing: string
		property: string
	},
	guard?: "agent" | "merchant"
): authly.Issuer<Omit<Key.Agent, "iat" | "token"> | Omit<Key, "iat" | "token">> | undefined {
	return authly.Issuer.create<Omit<Key.Agent, "iat" | "token"> | Omit<Key, "iat" | "token">>(
		"payfunc",
		secrets ? authly.Algorithm.create("HS256", secrets.signing) : undefined
	)?.add(
		guard == "merchant"
			? new authly.Property.Typeguard<Key>(Key.is)
			: guard == "agent"
			? new authly.Property.Typeguard<Key.Agent>(Key.Agent.is)
			: undefined,
		...getIssuerTransformations(secrets.property)
	)
}
export async function unpack(token: authly.Token, ...audience: Audience[]): Promise<Key | undefined> {
	return await getVerifier().verify(token, ...audience)
}
function getIssuerTransformations(secret?: string | undefined): authly.Property.Transformer[] {
	return [
		authly.Property.Remover.create(["token"]),
		authly.Property.Crypto.create(
			secret,
			"mash",
			"sms",
			"email",
			"option.mash",
			"option.sms",
			"option.email",
			"card.acquirer",
			"card.emv3d"
		),
		featuresTransformer,
	].filter(authly.Property.Transformer.is)
}
function getCardVerifier(
	legacyCrypto: authly.Property.Transformer | undefined,
	...algorithms: authly.Algorithm[]
): authly.Verifier<card.Merchant.Key> {
	return authly.Verifier.create<card.Merchant.Key>(...algorithms)?.add(
		authly.Property.Transformer.create({ reverse: card.Merchant.Key.upgrade }),
		legacyCrypto
	)
}
const featuresTransformer = authly.Property.Transformer.create({
	apply: (payload: Key) => {
		return { ...payload, features: flagly.Flags.stringify(payload?.features ?? {}) }
	},
	reverse: payload => {
		const flags =
			payload?.email || (V1.is(payload) && payload.option.email)
				? { deferAllowed: true, emailOption: true }
				: payload?.sms || (V1.is(payload) && payload.option.sms)
				? { deferAllowed: true }
				: {}
		return {
			...payload,
			features: flagly.reduce(typeof payload?.features == "string" ? flagly.parse(payload.features) : {}, flags),
		}
	},
})
