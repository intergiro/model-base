import { User } from "."

describe("User.Base", () => {
	it("user with id", async () => {
		const value: any = {
			id: "abcd0123",
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
		expect(User.Base.is(value)).toBeTruthy()
		expect(User.Base.flaw(value)).toEqual({ flaws: [], type: "model.User.Base" })
	})
	it("user without id", async () => {
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
		expect(User.Base.is(value)).toBeTruthy()
		expect(User.Base.flaw(value)).toEqual({ flaws: [], type: "model.User.Base" })
	})
	it("user without id", async () => {
		const value: any = {
			email: "a string",
			merchant: {
				id: "abcd0123",
				name: "merchant",
				key: {
					private: "aaa.bbb.ccc",
				},
			},
		}
		expect(User.Base.is(value)).toBeFalsy()
		expect(User.Base.flaw(value)).toEqual({
			flaws: [
				{
					property: "option",
					type: "{ [key: string]: any }",
				},
			],
			type: "model.User.Base",
		})
	})
})
