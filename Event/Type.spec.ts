import * as model from "../index"

describe("model.Event.Type", () => {
	it("is undefined", () => expect(model.Event.Type.is(undefined)).toBeFalsy())
	it("is blalbla", () => expect(model.Event.Type.is("blabla")).toBeFalsy())
	it("is order", () => expect(model.Event.Type.is("order")).toBeTruthy())
	it("is cancel", () => expect(model.Event.Type.is("cancel")).toBeTruthy())
	it("is charge", () => expect(model.Event.Type.is("charge")).toBeTruthy())
	it("is pay", () => expect(model.Event.Type.is("pay")).toBeTruthy())
	it("is refund", () => expect(model.Event.Type.is("refund")).toBeTruthy())
	it("is fail", () => expect(model.Event.Type.is("fail")).toBeTruthy())
})
