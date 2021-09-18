import * as model from "./index"

describe("EmailAddresses", () => {
	it("is", () => expect(model.EmailAddresses.is({ primary: "first.last@email.com" })).toBeTruthy())
	it("is not undefined", () => expect(model.EmailAddresses.is(undefined)).toBeFalsy())
	it("is not {}", () => expect(model.EmailAddresses.is({})).toBeFalsy())
	it("get undefined", () => expect(model.EmailAddresses.get(undefined)).toBeUndefined())
	it("get string", () => expect(model.EmailAddresses.get("first.last@email.com")).toEqual("first.last@email.com"))
	it("get primary", () =>
		expect(model.EmailAddresses.get({ primary: "first.last@email.com" })).toEqual("first.last@email.com"))
	it("get billing", () =>
		expect(model.EmailAddresses.get({ billing: "first.last@email.com" })).toEqual("first.last@email.com"))
})
