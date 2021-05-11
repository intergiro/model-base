import * as model from "./index"

const agent: model.Key & { aud: "agent" } = {
	iss: "issuer",
	iat: 12345678,

	sub: "test",
	aud: "agent",
	name: "testAgent",

	url: "www.example.net",
	card: {
		url: "http://localhost:7082",
		id: "test",
		country: "SE",
		acquirer: {
			protocol: "clearhaus",
			url: "https://gateway.test.clearhaus.com",
			key: "4321-1234-4321-1234-4321-1234",
			bin: { visa: "4321", mastercard: "0000" },
		},
		mid: "1234",
		mcc: "1234",
		emv3d: {
			protocol: "ch3d1",
			url: "http://localhost:7082/ch3d1sim",
			key: "no-key",
		},
	},
	token: "jwt.token.123",
}

const creatable = {
	name: "testMerchant",
	card: {
		acquirer: {
			bin: { visa: "111111", mastercard: "222222" },
		},
		url: "some.website.net",
		emv3d: {
			key: "some-different-key",
		},
	},
}

describe("Agent", () => {
	it("createMerchant", () => {
		expect(model.Agent.createMerchant(agent, creatable as model.Key.Creatable)).toMatchObject(creatable)
	})
})
