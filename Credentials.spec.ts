import * as model from "./index"

describe("Credentials", () => {
	const authorization = "Basic dGVzdEB0ZXN0LmNvbTpwYXNzd29yZA=="
	const user = "test@test.com"
	const password = "password"
	it("fromBasic", async () => {
		expect(await model.Credentials.fromBasic(authorization)).toEqual({ user, password })
	})
	it("toBasic", async () => {
		expect(await model.Credentials.toBasic({ user, password })).toEqual(authorization)
	})
})
