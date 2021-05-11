import { Audience } from "./Audience"

describe("Key.V1.Audience", () => {
	it("is private", () => expect(Audience.is("private")).toBeTruthy())
	it("is public", () => expect(Audience.is("private")).toBeTruthy())
	it("is private, public", () => expect(Audience.is(["private", "public"])).toBeTruthy())
})
