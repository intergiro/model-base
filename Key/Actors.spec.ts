import { Key } from "./index"

const secrets = {
	signing: "secret",
	property: "secret1",
	signingV1: "secret2",
	propertyV1: "secret3",
}

const unpacked: Key = {
	sub: "testtest",
	iss: "http://localhost:7071",
	aud: "private",
	iat: 1583504065,
	name: "Test AB",
	url: "http://example.com",
	card: {
		url: "http://localhost:7082",
		id: "test",
		country: "SE",
		acquirer: {
			protocol: "clearhaus",
			url: "test.com",
			key: "1234-1234-4321",
			bin: { visa: "1111", mastercard: "112233" },
		},
		mid: "1234",
		mcc: "1234",
		emv3d: {
			protocol: "ch3d1",
			url: "http://localhost:7082/ch3d1sim",
			key: "no-key",
		},
	},
	email: { key: "testing", notify: "features" },
	features: { fun: true, nested: { works: true, orNot: false } },
	token: "jwt.token.123",
}

const verifier = Key.getVerifier(secrets)
const issuer = Key.getIssuer(secrets)
describe("Actors", () => {
	it("Issue something", async () => {
		const token = issuer ? await issuer.sign(unpacked) : undefined
		expect(await verifier?.verify(token)).toEqual({
			...unpacked,
			token,
			features: {
				deferAllowed: true,
				emailOption: true,
				fun: true,
				nested: { works: true, orNot: false },
			},
		})
	})
})
