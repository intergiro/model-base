import * as model from "./index"

describe("Item", () => {
	const item: model.Item = {
		number: "ts001-b",
		name: "Basic T-shirt, black",
		price: 119.6,
		vat: 29.9,
		quantity: 2,
	}
	const twoItems: model.Item[] = [
		{
			number: "ab001",
			name: "sko",
			price: 100,
			vat: 20,
			quantity: 4,
		},
		{
			number: "cd002",
			name: "boll",
			price: 150,
			vat: 30,
			quantity: 2,
		},
	]
	const orderEvent: model.Event = {
		type: "order",
		date: "2019-02-01T12:00:00",
	}
	const chargeOne: model.Event = {
		type: "charge",
		date: "2019-02-01T12:10:00",
		items: {
			number: "ab001",
			name: "sko",
			price: 100,
			vat: 20,
			quantity: 1,
		},
	}
	const refundTwo: model.Event = {
		type: "refund",
		date: "2019-02-01T12:20:00",
		items: {
			number: "ab001",
			name: "sko",
			price: 100,
			vat: 20,
			quantity: 2,
		},
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
	it("applyEvent", () => {
		const items = [{ ...item }]
		model.Item.applyEvent(items, { type: "order", date: "2019-10-10T00:00:00" })
		expect(items).toEqual([
			{
				name: "Basic T-shirt, black",
				number: "ts001-b",
				price: 119.6,
				quantity: 2,
				status: ["ordered", "ordered"],
				vat: 29.9,
			},
		])
	})
	it("applyItem order 3", () => {
		const items = [{ ...item }, { ...item }]
		model.Item.applyItem(items, "order", 3, item)
		expect(items).toMatchObject([{ status: ["ordered", "ordered"] }, { status: ["ordered", "created"] }])
	})
	it("applyItem order 1", () => {
		const items = [{ ...item }, { ...item }]
		model.Item.applyItem(items, "order", 1, item)
		expect(items).toMatchObject([{ status: ["ordered", "created"] }, { status: ["created", "created"] }])
	})
	it("fromVatInclusivePrice", () =>
		expect(model.Item.fromVatInclusivePrice(250, 0.25)).toMatchObject({ price: 200, vat: 50 }))
	it("isEventAllowed false if charge without order", () => {
		expect(model.Item.isEventAllowed(twoItems, chargeOne as model.Event)).toEqual(false)
	})
	it("isEventAllowed true when charge after order", () => {
		model.Item.applyEvent(twoItems, orderEvent)
		expect(model.Item.isEventAllowed(twoItems, chargeOne as model.Event)).toEqual(true)
	})
	// Note that applied events carry over to the next test
	it("isEventAllowed false when refund without enough charged", () => {
		model.Item.applyEvent(twoItems, chargeOne)
		expect(model.Item.isEventAllowed(twoItems, refundTwo as model.Event)).toEqual(false)
	})
	it("isEventAllowed true when refund after enough charge", () => {
		model.Item.applyEvent(twoItems, chargeOne)
		expect(model.Item.isEventAllowed(twoItems, refundTwo as model.Event)).toEqual(true)
	})
	it("isEventAllowed true when charge refund charge", () => {
		model.Item.applyEvent(twoItems, refundTwo)
		expect(model.Item.isEventAllowed(twoItems, chargeOne as model.Event)).toEqual(true)
	})
	it("isEventAllowed can't charge more than ordered", () => {
		const chargeTooMany: model.Event = {
			type: "charge",
			date: "2019-02-01T12:10:00",
			items: {
				number: "cd002",
				name: "boll",
				price: 150,
				vat: 30,
				quantity: 3,
			},
		}
		model.Item.applyEvent(twoItems, orderEvent)
		expect(model.Item.isEventAllowed(twoItems, chargeTooMany as model.Event)).toEqual(false)
	})
})
