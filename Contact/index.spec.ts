import * as model from "../index"

describe("Contact", () => {
	const tom = {
		type: "person",
		identitityNumber: "198506086118",
		id: "KUjNHzpvmp9oAmW+SzX8Rhr32BNpYLRdWv_to6gBX8M=",
		name: "Tom Johansson",
		address: {
			street: "Törnsjövägen 1",
			zipCode: "16001",
			city: "Stockholm",
			countryCode: "SE",
		},
	}
	it("is tom", () => expect(model.Contact.is(tom)).toBe(true))
	it("flaw tom", () => expect(model.Contact.flaw(tom)).toEqual({ flaws: [], type: "model.Contact" }))
	it("is contact", () =>
		expect(
			model.Contact.is({
				type: "person",
				identitityNumber: "198506086118",
				id: "KUjNHzpvmp9oAmW+SzX8Rhr32BNpYLRdWv_to6gBX8M=",
				name: "Tom Johansson",
				street: "Törnsjövägen 1",
				zipCode: "16001",
				city: "Stockholm",
				countryCode: "MT",
			})
		).toBeTruthy())
	it("is contact", () =>
		expect(
			model.Contact.is({
				type: "person",
				identitityNumber: "198506086118",
				id: "KUjNHzpvmp9oAmW+SzX8Rhr32BNpYLRdWv_to6gBX8M=",
				name: "Tom Johansson",
				zipCode: "abc",
				countryCode: "MT",
			})
		).toBeTruthy())
	it("is contact", () =>
		expect(
			model.Contact.is({
				type: "person",
				identitityNumber: "198506086118",
				id: "KUjNHzpvmp9oAmW+SzX8Rhr32BNpYLRdWv_to6gBX8M=",
				name: "Tom Johansson",
				countryCode: "FI",
			})
		).toBeTruthy())
})
