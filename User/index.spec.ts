import * as model from "../index"

describe("User", () => {
	it("user, with id that is an authly.Identifier", async () => {
		const value: any = {
			id: "abcd0001",
			email: "a string",
			merchant: {
				id: "abcd0001",
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
		expect(model.User.is(value)).toBeTruthy()
	})
	it("user, with id that isn't an authly.Identifier", async () => {
		const value: any = {
			id: "abcd0001",
			email: "a string",
			merchant: {
				id: "abcd0001",
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
		expect(model.User.is(value)).toBeTruthy()
	})
	it("user without id", async () => {
		const value: any = {
			email: "a string",
			merchant: {
				id: "abcd0001",
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
		expect(model.User.is(value)).toBeFalsy()
	})
	it("user, with public instead of private key", async () => {
		const value: any = {
			id: "abcd0001",
			email: "a string",
			merchant: {
				id: "abcd0001",
				name: "merchant",
				key: {
					public: "aaa.bbb.ccc",
				},
			},
			option: {
				byBoat: "no",
				byPlane: {
					maybe: ["yes", "no"],
				},
			},
		}
		expect(model.User.is(value)).toBeFalsy()
	})
	it("user, with non token private key", async () => {
		const value: any = {
			id: "abcd0001",
			email: "a string",
			merchant: {
				id: "abcd0001",
				name: "merchant",
				key: {
					private: "aaa-bbb-ccc",
				},
			},
			option: {
				byBoat: "no",
				byPlane: {
					maybe: ["yes", "no"],
				},
			},
		}
		expect(model.User.is(value)).toBeFalsy()
	})
	it("user, with empty option", async () => {
		const value: any = {
			id: "abcd0001",
			email: "a string",
			merchant: {
				id: "abcd0001",
				name: "merchant",
				key: {
					private: "aaa-bbb-ccc",
				},
			},
			option: {},
		}
		expect(model.User.is(value)).toBeFalsy()
	})
	it("user, without email", async () => {
		const value: any = {
			id: "abcd0001",
			merchant: {
				id: "abcd",
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
		expect(model.User.is(value)).toBeFalsy()
	})
	it("user, with array email", async () => {
		const value: any = {
			id: "abcde",
			email: ["abc@mail.com"],
			merchant: {
				id: "abcd",
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
		expect(model.User.is(value)).toBeFalsy()
	})
	it("user, with empty email string", async () => {
		const value: any = {
			id: "abcd0001",
			email: "",
			merchant: {
				id: "abcd0001",
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
		expect(model.User.is(value)).toBeTruthy()
	})
	it("user, with empty strings", async () => {
		const value: any = {
			id: "abcd0001",
			email: "",
			merchant: {
				id: "abcd0001",
				name: "",
				key: {
					private: "aaa.bbb.ccc",
				},
			},
			option: {
				"": "",
			},
		}
		expect(model.User.is(value)).toBeTruthy()
	})
	it("user, with empty strings and missing merchant name", async () => {
		const value: any = {
			id: "abcd0001",
			email: "",
			merchant: {
				id: "",
				key: {
					private: "aaa.bbb.ccc",
				},
			},
			option: {
				"": "",
			},
		}
		expect(model.User.is(value)).toBeFalsy()
	})
	it("user, with empty strings and missing option array", async () => {
		const value: any = {
			id: "abcd0001",
			email: "",
			merchant: {
				id: "",
				name: "",
				key: {
					private: "aaa.bbb.ccc",
				},
			},
		}
		expect(model.User.is(value)).toBeFalsy()
	})
	it("user, with empty strings and missing key", async () => {
		const value: any = {
			id: "abcd0001",
			email: "",
			merchant: {
				id: "",
				name: "",
			},
			option: {
				"": "",
			},
		}
		expect(model.User.is(value)).toBeFalsy()
	})
	it("array with a user inside", async () => {
		const value: any = [
			{
				id: "abcd0001",
				email: "a string",
				merchant: {
					id: "abcd0001",
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
			},
		]
		expect(model.User.is(value)).toBeFalsy()
	})
	it("empty object", async () => {
		const value: any = undefined
		expect(model.User.is(value)).toBeFalsy()
	})
})
