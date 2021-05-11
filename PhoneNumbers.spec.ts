import * as model from "./index"

describe("PhoneNumbers", () => {
	it("is", () => expect(model.PhoneNumbers.is({ primary: "+46-18-12 34 56" })).toBeTruthy())
	it("is not undefined", () => expect(model.PhoneNumbers.is(undefined)).toBeFalsy())
	it("is not {}", () => expect(model.PhoneNumbers.is({})).toBeFalsy())
	it("get undefined", () => expect(model.PhoneNumbers.get(undefined)).toBeUndefined())
	it("get string", () => expect(model.PhoneNumbers.get("+46-18-12 34 56")).toEqual("+46-18-12 34 56"))
	it("get primary", () => expect(model.PhoneNumbers.get({ primary: "+46-18-12 34 56" })).toEqual("+46-18-12 34 56"))
	it("get landline", () => expect(model.PhoneNumbers.get({ landline: "+46-18-12 34 56" })).toEqual("+46-18-12 34 56"))
})
