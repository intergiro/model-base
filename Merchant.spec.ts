import * as model from "./index"

describe("Merchant", () => {
	const merchant = {
		id: "par9par9",
		name: "test",
		option: {},
		key: {
			public: "a.b.c",
			private: "a.b.c",
		},
	}
	it("is", () => {
		expect(model.Merchant.is(merchant)).toBeTruthy()
	})
	it("is missing id name", () => expect(model.Merchant.is({})).toBeFalsy())
	it("flaw", () => {
		expect(model.Merchant.flaw(merchant)).toEqual({
			flaws: [],
			type: "model.Merchant",
		})
	})
})
