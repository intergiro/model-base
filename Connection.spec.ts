import * as model from "./Connection"

describe("connection test", () => {
	it("open", () => {
		const connection = model.Connection.open("", "")
		expect(connection).toBeTruthy()
		expect(connection.get(model.Connection?.url ?? "")).toBeTruthy()
	})
})
