import * as model from "../index"

describe("Event.Settle tests", () => {
	it("example", () => {
		expect(
			model.Event.Settle.is({
				type: "settle",
				period: {
					start: "2020-09-23",
					end: "2020-09-30",
				},
				payout: "2020-10-01",
				gross: 25,
				net: 24.25,
				fee: -0.75,
				currency: "SEK",
				descriptor: "example",
				reference: "example",
				date: "2020-10-02T10:25:00.000Z",
			})
		).toBeTruthy()
	})
	it("create", () => {
		const settlement: model.Event.Creatable & any = {
			type: "settle",
			period: {
				start: "2020-09-23",
				end: "2020-09-30",
			},
			gross: -25,
			net: -27.25,
			fee: -2.25,
			currency: "SEK",
			descriptor: "example",
			reference: "example",
		}
		expect(model.Event.Settle.is(model.Event.create(settlement, "2020-10-02T10:25:00.000Z"))).toBeTruthy()
	})
	it("merge", () => {
		const array: model.Event.Settle[] = [
			{
				type: "settle",
				period: {
					start: "2020-09-23",
					end: "2020-09-30",
				},
				payout: "2020-10-01",
				gross: 25,
				net: 24.25,
				fee: -0.75,
				currency: "SEK",
				descriptor: "example",
				reference: "example",
				date: "2020-10-02T10:25:00.000Z",
			},
			{
				type: "settle",
				period: {
					start: "2020-09-23",
					end: "2020-09-30",
				},
				payout: "2020-10-01",
				gross: -25,
				net: -25.75,
				fee: -0.75,
				currency: "SEK",
				descriptor: "example",
				reference: "example",
				date: "2020-10-02T10:25:00.000Z",
			},
		]
		const merged = model.Event.Settle.merge(array)
		expect(merged.gross).toEqual(0)
		expect(merged.net).toEqual(-1.5)
		expect(merged.fee).toEqual(-1.5)
	})
})
