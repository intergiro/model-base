import * as isoly from "isoly"
import * as model from "../index"

describe("Event", () => {
	const events = [
		{
			type: "charge",
			items: [
				{
					name: "Basic T-shirt, black",
					price: 119.6,
					quantity: 2,
					vat: 29.9,
				},
			],
			date: "2019-02-01T12:00:00",
		},
	]
	it("date", () => expect(isoly.DateTime.is(events[0].date)).toBeTruthy())
	it("is", () => expect(model.Event.is(events[0])).toBeTruthy())
	it("is []", () => expect(events.every(model.Event.is)).toBeTruthy())
})
