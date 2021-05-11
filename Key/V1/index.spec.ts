import { V1 } from "./index"

describe("Merchant.Key", () => {
	const key = {
		iss: "http://localhost:7071",
		iat: 1567333057361,
		aud: ["private", "public"],
		sub: "e5CyF8E4",
		user: "test@test.com",
		name: "Test Merchant",
		option: {
			option0: "abcdefg",
		},
	}
	it("is", () => expect(V1.is(key)).toBeTruthy())
	it("V1.Creatable.is", () => expect(V1.Creatable.is(key)).toBeTruthy())
	it("flaw", () => {
		const k = key
		delete k.sub
		expect(V1.flaw(key)).toEqual({
			flaws: [
				{
					condition: "Merchant identifier.",
					property: "sub",
					type: "authly.Identifier",
				},
			],
			type: "model.Key.V1",
		})
	})
})
