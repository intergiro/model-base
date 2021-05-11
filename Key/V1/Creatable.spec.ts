import { Creatable } from "../Creatable"
import { Creatable as CreatableV1 } from "./Creatable"

describe("model.Key", () => {
	const v1: CreatableV1 = {
		name: "testtest",
		logotype: "https:/example.com",
		terms: "https:/example.com",
		option: {
			email: {
				key: "exampleKey",
				notify: "notifyvalue",
			},
			mash: {
				url: "https://mash.example/api",
				user: "test01",
				key: "exampleKey",
				merchant: 5,
			},
			sms: {
				key: "exampleKey",
				sender: "TestMerchant",
			},
			card: {
				acquirer: {
					bin: {
						mastercard: "1234",
						visa: "1234",
					},
					key: "1234-1234-1234",
					protocol: "clearhaus",
					url: "https://gateway.test.clearhaus.com",
				},
				agent: "test",
				aud: "private",
				country: "SE",
				descriptor: "test transaction",
				emv3d: {
					protocol: "ch3d1",
					url: "http://localhost:7082/ch3d1sim",
					key: "no-key",
				},
				iat: 1583503730970,
				id: "test",
				iss: "http://localhost:7082",
				mcc: "1234",
				mid: "1234",
				name: "Test AB",
				sub: "test",
				type: "test",
				url: "http://example.com",
			},
		},
	}
	it("Upgrade v1 Creatable", () => {
		expect(CreatableV1.is(v1)).toBeTruthy()
		const upgraded = Creatable.upgrade(v1)
		expect(upgraded).toBeTruthy()
		expect(Creatable.is(upgraded)).toBeTruthy()
	})
	it("Upgrade v1 Creatable (option.card as jwt shouldn't work)", () => {
		const v1b = { ...v1, option: { ...v1.option, card: "eyJ.jwt.sgn" } }
		expect(CreatableV1.is(v1b)).toBeTruthy()
		expect(Creatable.upgrade(v1b)).toBeUndefined()
	})
})
