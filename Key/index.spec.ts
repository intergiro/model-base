import * as dotenv from "dotenv"
import { Key } from "./index"
import { V1 } from "./V1"
dotenv.config()

const testMerchantKey = {
	sub: "testtest",
	iss: "http://localhost:7071",
	aud: "private",
	iat: 1602056367,
	name: "testtest",
	url: "http://example.com",
	card: {
		url: "http://localhost:7082",
		id: "test",
		country: "SE",
		acquirer: {
			bin: { mastercard: "1234", visa: "1234" },
			key: "1234-1234-1234",
			protocol: "clearhaus",
			url: "https://gateway.test.clearhaus.com",
		},
		mid: "1234",
		mcc: "1234",
		emv3d: {
			protocol: "ch3d1",
			url: "http://localhost:7082/ch3d1sim",
			key: "no-key",
		},
	},
	email: { key: "akey", notify: "notifyvalue" },
	mash: {
		url: "https://mash.example/api",
		user: "test01",
		key: "akey",
		merchant: 5,
	},
	sms: { key: "akey", sender: "TestMerchant" },
}
const keyInformation = {
	sub: "testtest",
	iss: "http://localhost:7071",
	aud: "private",
	iat: 1602056367,
	name: "testtest",
	url: "http://example.com",
	card: {
		url: "http://localhost:7082",
		id: "test",
		country: "SE",
		mid: "1234",
		mcc: "1234",
	},
	features: { deferAllowed: true, emailOption: true },
}

const testMerchantKeyV1 = {
	iss: "http://localhost:7071",
	iat: 1593589747536,
	sub: "testtest",
	name: "testtest",
	option: {
		email: {
			key: "akey",
			notify: "notifyvalue",
		},
		mash: {
			url: "https://mash.example/api",
			user: "test01",
			key: "akey",
			merchant: 5,
		},
		sms: {
			key: "akey",
			sender: "TestMerchant",
		},
		card:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjcwODIiLCJpYXQiOjE1ODM1MDM3MzA5NzAsImF1ZCI6InByaXZhdGUiLCJzdWIiOiJ0ZXN0IiwiYWdlbnQiOiJ0ZXN0IiwidHlwZSI6InRlc3QiLCJpZCI6InRlc3QiLCJuYW1lIjoiVGVzdCBBQiIsInVybCI6Imh0dHA6Ly9leGFtcGxlLmNvbSIsImRlc2NyaXB0b3IiOiJ0ZXN0IHRyYW5zYWN0aW9uIiwiY291bnRyeSI6IlNFIiwiYWNxdWlyZXIiOiJZQ0x6ZjJrVEZNbkRKa2NHVDlmRTBoanFhNlZpS09YTHZnRS1DTTF3UzE1djVnNXRKNVZ5ZXQzVHFCQUh3Y29WOXQ3WkFQancxNUktZllLX3hIT2d1eUlzSW5CeWIzUnZZMjlzSWpvaVkyeGxZWEpvWVhWeklpd2lkWEpzSWpvaWFIUjBjSE02THk5bllYUmxkMkY1TG5SbGMzUXVZMnhsWVhKb1lYVnpMbU52YlNKOSIsIm1pZCI6IjEyMzQiLCJtY2MiOiIxMjM0IiwiZW12M2QiOiJtaGxZTXdTeTVtWm94M29ISEJDYjdxTHlkcVRFUzB3b2hQelBxZVFZa3RaSERKek5QaFl4Yk9qckJSNUxnaVNKWDRpTVh4TllLZlZHZkNEWnIySnRxam9pYm04dGEyVjVJbjAifQ.RHkzRYgOUUq5eaO-cx-lh0C85NCS4S1Xd7CS9uCose0",
	},
	aud: ["private", "public"],
}

const keyInformationV1 = {
	aud: "public",
	card: { country: "SE", id: "test", mcc: "1234", mid: "1234", url: "https://api.cardfunc.com" },
	features: { deferAllowed: true, emailOption: true },
	iat: 1583935456,
	iss: "https://api.payfunc.com",
	name: "Test AB",
	sub: "testtest",
	url: "http://example.com",
}
const issuer = Key.getIssuer({ signing: "test", property: "test2" })
describe("General Key", () => {
	it("MerchantKey is General Key before change in variable name", async () => {
		expect(Key.is(testMerchantKey)).toEqual(true)
	})
	it("V1 Key is not Key", async () => {
		expect(Key.is(testMerchantKeyV1)).toBeFalsy()
		expect(V1.is(testMerchantKeyV1)).toEqual(true)
	})
	it("Unpack into Keyinfo", async () => {
		const token = Key.is(testMerchantKey) ? await issuer?.sign(testMerchantKey) : ""
		const keyinfo = token ? await Key.unpack(token) : undefined
		expect(keyinfo).toEqual({ ...keyInformation, token })
	})

	it("Unpack Legacy Key into Keyinfo", async () => {
		const token =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwaS5wYXlmdW5jLmNvbSIsImlhdCI6MTU4MzkzNTQ1NjE3MSwic3ViIjoidGVzdHRlc3QiLCJhZ2VudCI6IlBheUZ1bmMiLCJ0eXBlIjoidGVzdCIsImlkIjoidGVzdHRlc3QiLCJuYW1lIjoiVGVzdCBBQiIsImxvZ290eXBlIjoiaHR0cHM6Ly9icmFuZC5wYXlmdW5jLmNvbS9sb2dvL3BuZy05MC9wYXlmdW5jLWwwOC05MC5wbmciLCJ0ZXJtcyI6Imh0dHBzOi8vcGF5ZnVuYy5jb20vYWJvdXQiLCJvcHRpb24iOnsiY2FyZCI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwYzNNaU9pSm9kSFJ3Y3pvdkwyRndhUzVqWVhKa1puVnVZeTVqYjIwaUxDSnBZWFFpT2pFMU9ETTFNRE15T1RBNU9EVXNJbUYxWkNJNkluQjFZbXhwWXlJc0luTjFZaUk2SW5SbGMzUWlMQ0poWjJWdWRDSTZJbEJoZVVaMWJtTWlMQ0owZVhCbElqb2lkR1Z6ZENJc0ltbGtJam9pZEdWemRDSXNJbTVoYldVaU9pSlVaWE4wSUVGQ0lpd2lkWEpzSWpvaWFIUjBjRG92TDJWNFlXMXdiR1V1WTI5dElpd2laR1Z6WTNKcGNIUnZjaUk2SW5SbGMzUWdkSEpoYm5OaFkzUnBiMjRpTENKamIzVnVkSEo1SWpvaVUwVWlMQ0poWTNGMWFYSmxjaUk2SWpGcWRXSnpRVUUyZWpGUGFETlhhMkp4VmxoVFYwZFRaVlIyWW1zM01WOTVibTVFYmtsdWFsSXhkaTFuT0RBM2RrWkZjbWhPWWsxVFFVVmxkMngzVmtjMk5ubzJUamt3WkRSbVUyWnpZMmhzTW1oblZXNVhNR2xNUTBweVdsaHJhVTlwU1hwT2JWVXpUa2RGTWs5VE1ETmFiVlpzVEZSU2FFMTZZM1JaYlU1clQxTXdNbGxVUlRCTmFrbDNUV3BvYlZwcVRXbE1RMHBwWVZjMGFVOXVjMmxrYld4NldWTkpOa2xxVVhwUFJFMTNUMU5KYzBsdE1XaGpNMUpzWTIxT2FHTnRVV2xQYVVreFRXcFpNVTU2UldsbVdEQWlMQ0p0YVdRaU9pSXhNak0wSWl3aWJXTmpJam9pTVRJek5DSXNJbVZ0ZGpOa0lqb2lUR0ZVUkdkSmRYRXdiWEV6WmxkR04wWTFObGRLWlVObmVUZE1RVTVFUXpadGNHbEJOMDlPV0hKblZHeGZUVlkyVWs1WllURnZiRE5mVm14WVlteGhWelp1T1dwR2IwTXRVRkpxTlZCRGVrcGFWVEY1WkVkV05VbHFiMmxpYlRoMFlUSldOVWx1TUNKOS5YZ2pyb1JsOWJXVzRNSl83Z1NJQVBPeGpZRXgyWTlfNzgzOGp0MWtxb01vIiwiZW1haWwiOiI1bXdpeTh3bHlDUy1PQTlkaURoekQxN1FLZVc5T2NkTTBpU01vZ193dmFUQ0g0d0hTVXZrem1lRTZmS1RIaGRxaUFKM2tDTmFLUU1fZFRQaWt4UENlbWRwTFhsNE0zQnJOWEJEZFVFaWZRIn0sImF1ZCI6InB1YmxpYyJ9.JYSWGVwPoyrofn0twsNMkZ8bI7yyM4DfcJd9SltIgZ4"
		expect(await Key.unpack(token, "public")).toEqual({ ...keyInformationV1, token })
	})
})
