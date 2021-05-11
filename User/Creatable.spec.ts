import { User } from "./"

describe("User.Creatable", () => {
	it("user with password", async () => {
		const value: any = {
			email: "a string",
			merchant: {
				id: "abcd0123",
				name: "merchant",
				key: {
					private: "aaa.bbb.ccc",
				},
			},
			password: "123456",
			option: {
				byBoat: "no",
				byPlane: {
					maybe: ["yes", "no"],
				},
			},
		}
		expect(User.Creatable.is(value)).toBeTruthy()
		const flawFeedback = User.Creatable.flaw(value)
		expect(flawFeedback.flaws && flawFeedback.flaws.length === 0).toBeTruthy()
	})
	it("user with password as array", async () => {
		const value: any = {
			email: "a string",
			merchant: {
				id: "abcd0123",
				name: "merchant",
				key: {
					private: "aaa.bbb.ccc",
				},
			},
			password: "",
			option: {
				byBoat: "no",
				byPlane: {
					maybe: ["yes", "no"],
				},
			},
		}
		expect(User.Creatable.is(value)).toBeTruthy()
		const flawFeedback = User.Creatable.flaw(value)
		expect(flawFeedback.flaws && flawFeedback.flaws.length === 0).toBeTruthy()
	})
	it("user without password", async () => {
		const value: any = {
			email: "a string",
			merchant: {
				id: "abcd0123",
				name: "merchant",
				key: {
					private: "aaa.bbb.ccc",
				},
			},
			option: {
				byBoat: "no",
				byPlane: {
					maybe: ["yes", "no"],
				},
			},
		}
		expect(User.Creatable.is(value)).toBeFalsy()
		const flawFeedback = User.Creatable.flaw(value)
		expect(flawFeedback.flaws && flawFeedback.flaws.length > 0).toBeTruthy()
		expect(User.Creatable.flaw(value)).toEqual({
			flaws: [
				{
					property: "password",
					type: "string | object",
				},
			],
			type: "model.User.Creatable",
		})
	})
})
