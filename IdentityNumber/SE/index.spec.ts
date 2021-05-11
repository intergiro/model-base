import * as model from "../../index"

describe("IdentityNumber.SE", () => {
	it("calculateChecksum", () => {
		expect(model.IdentityNumber.SE.calculateChecksum("1234567897")).toBe(7)
	})
	it("is", () => {
		expect(model.IdentityNumber.SE.is("1234567897"))
		expect(model.IdentityNumber.SE.is("1234567890")).toBeFalsy() // wrong checksum
	})
	it("format", () => {
		expect(model.IdentityNumber.SE.format("1234567897")).toBe("123456-7897")
		expect(model.IdentityNumber.SE.format("161234567897")).toBe("16123456-7897")
	})
	it("parse", () => {
		expect(model.IdentityNumber.SE.parse("123456-7897")).toBe("1234567897")
		expect(model.IdentityNumber.SE.parse("16123456-7897")).toBe("161234567897")
		expect(model.IdentityNumber.SE.parse("123456+7897")).toBe("1234567897")
		expect(model.IdentityNumber.SE.parse("123456 7897")).toBe("1234567897")
		expect(model.IdentityNumber.SE.parse("16123456 7897")).toBe("161234567897")
		expect(model.IdentityNumber.SE.parse("1234567897")).toBe("1234567897")
		expect(model.IdentityNumber.SE.parse("161234567897")).toBe("161234567897")
	})
})
