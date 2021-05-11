import * as gracely from "gracely"
import * as authly from "authly"
import * as dotenv from "dotenv"
import * as model from "./index"

jest.setTimeout(100000)
dotenv.config()
model.Connection.baseUrl = process.env.backendUrl || ""

describe("Connection", () => {
	it("fails login", async () => {
		const wrongUser = "Petter"
		const wrongPassword = "qwerty"
		expect(await model.Connection.login(wrongUser, wrongPassword)).toMatchObject({
			status: 401,
			type: "not authorized",
		})
	})
	it("logs in", async () => {
		let userValid = false
		let keyValid = false
		model.Connection.userChanged.push(user => (userValid = model.User.is(user)))
		model.Connection.keyChanged.push(key => (keyValid = authly.Token.is(key)))
		expect(
			await model.Connection.login(process.env.backendUser || "", process.env.backendPassword || "")
		).toMatchObject({ email: process.env.backendUser })
		expect(userValid)
		expect(keyValid)
	})
	it("reauthenticate", async () => {
		model.Connection.reauthenticate = async () => {
			const user = await model.Connection.login(process.env.backendUser || "", process.env.backendPassword || "")
			let result: gracely.Error | [model.User, authly.Token]
			if (gracely.Error.is(user))
				result = user
			else {
				let merchant = user.merchant
				if (Array.isArray(merchant))
					merchant = merchant[0]
				result = [user, merchant.key.private]
			}
			return result
		}
		const orders = await model.Connection.get<model.Order[]>("order")
		expect(Array.isArray(orders)).toBeTruthy()
	})
})
