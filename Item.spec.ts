import * as model from "./index"

describe("Item", () => {
	const item: model.Item = {
		number: "ts001-b",
		name: "Basic T-shirt, black",
		price: 119.6,
		vat: 29.9,
		quantity: 2,
	}
	it("is item", () => expect(model.Item.is(item)).toBeTruthy())
	it("is item w/o number", () =>
		expect(
			model.Item.is({
				name: "Basic T-shirt, black",
				price: 119.6,
				vat: 29.9,
				quantity: 2,
			})
		).toBeTruthy())
	it("items", () => expect(model.Item.canBe([item, item])).toBeTruthy())
	it("canBe number", () => expect(model.Item.canBe(1337.42)).toBeTruthy())
	it("canBe item", () => expect(model.Item.canBe(item)).toBeTruthy())
	it("canBe item[]", () => expect(model.Item.canBe([item, item])).toBeTruthy())
	it("vat", () => expect(model.Item.vat(item)).toBe(59.8))
	it("vat total", () => expect(model.Item.vat([item, item])).toEqual(119.6))
	it("amount number", () => expect(model.Item.amount(1337)).toBe(1337))
	it("amount item", () => expect(model.Item.amount(item)).toBe(299))
	it("amount items", () => expect(model.Item.amount([item, item])).toBe(598))
	it("as array", () =>
		expect(model.Item.asArray([item, item])).toEqual([
			{
				number: "ts001-b",
				name: "Basic T-shirt, black",
				price: 119.6,
				vat: 29.9,
				quantity: 2,
			},
			{
				number: "ts001-b",
				name: "Basic T-shirt, black",
				price: 119.6,
				vat: 29.9,
				quantity: 2,
			},
		]))
	it("fromVatInclusivePrice", () =>
		expect(model.Item.fromVatInclusivePrice(250, 0.25)).toMatchObject({ price: 200, vat: 50 }))
})
