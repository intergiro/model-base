import * as model from "./Connection"

jest.setTimeout(50000)
describe("connection test", () => {
	it("calling non existing endpoint", async () => {
		const connection = model.Connection.open("https://merchant.intergiro.com/v1", "")
		expect(connection).toBeTruthy()
		interface ReturnType {
			something: string
		}
		expect(await connection.get<ReturnType>("/notexistingendpoint")).toEqual({
			status: 404,
			type: "not found",
		})
	})
	it.skip("open incorrect url (might get string)", async () => {
		const connection = model.Connection.open("https://merchant.intergiro.com/v", "")
		expect(connection).toBeTruthy()
		interface ReturnType {
			something: string
		}
		expect(await connection.get<ReturnType>("/notexistingendpoint")).toEqual({
			status: 500,
			type: "unknown error",
			details: expect.any(String),
		})
	})
	it("open unauthorized", async () => {
		const connection = model.Connection.open("https://merchant.intergiro.com/v1", "")
		expect(connection).toBeTruthy()
		interface ReturnType {
			something: string
		}
		expect(await connection.get<ReturnType>("/authorization")).toEqual({
			error: "unauthorized",
			status: 401,
			type: "not authorized",
		})
	})
})
