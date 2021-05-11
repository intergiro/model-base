import * as gracely from "gracely"
import * as authly from "authly"
import { Credentials } from "./Credentials"
import { fetch, RequestInit } from "./fetch"
import { User } from "./User"

export abstract class Connection {
	private static storageValue: Storage | undefined | null = null
	private static get storage(): Storage | undefined {
		if (Connection.storageValue == null) {
			const date = new Date().toUTCString()
			let result: Storage | undefined
			try {
				const storage = window.localStorage
				storage.setItem("test", date)
				if (storage.getItem("test") == date)
					result = storage
				storage.removeItem("test")
			} catch (exception) {
				console.log(exception)
			}
			Connection.storageValue = result
		}
		return Connection.storageValue
	}
	private static baseUrlValue?: string
	static get baseUrl(): string {
		const storage = Connection.storage
		if (storage)
			Connection.baseUrlValue = JSON.parse(storage.getItem("PayFunc baseUrl") ?? "undefined")
		return Connection.baseUrlValue ?? "/"
	}
	static set baseUrl(value: string) {
		const storage = Connection.storage
		if (storage)
			if (value)
				storage.setItem("PayFunc baseUrl", JSON.stringify(value))
			else
				storage.removeItem("PayFunc baseUrl")
		Connection.baseUrlValue = value
	}
	private static userValue?: User
	static get user(): User | undefined {
		const storage = Connection.storage
		if (storage)
			Connection.userValue = JSON.parse(storage.getItem("PayFunc user") || "false") || (undefined as User | undefined)
		return Connection.userValue
	}
	static set user(user: User | undefined) {
		const storage = Connection.storage
		if (storage)
			if (user)
				storage.setItem("PayFunc user", JSON.stringify(user))
			else
				storage.removeItem("PayFunc user")
		Connection.userValue = user
		Connection.userChanged.forEach(callback => callback(Connection.userValue))
	}
	static readonly userChanged: ((user: User | undefined) => void)[] = []
	private static keyValue?: authly.Token
	static get key(): authly.Token | undefined {
		const storage = Connection.storage
		if (storage)
			Connection.keyValue = (storage.getItem("PayFunc key") || undefined) as authly.Token | undefined
		return Connection.keyValue
	}
	static set key(key: authly.Token | undefined) {
		const storage = Connection.storage
		if (storage)
			if (key)
				storage.setItem("PayFunc key", key)
			else
				storage.removeItem("PayFunc key")
		Connection.keyValue = key
		Connection.keyChanged.forEach(callback => callback(Connection.keyValue))
	}
	static get accountKeys(): authly.Token[] {
		const result = []
		const storage = Connection.storage
		for (let i = 0; i < (storage?.length ?? 0); i++) {
			const item = storage?.key(i)
			if (authly.Identifier.is(item, 16))
				result.push(storage?.getItem(item))
		}
		return result.filter(authly.Token.is)
	}
	static setAccountKeys(key: authly.Token, accountId: authly.Identifier) {
		const storage = Connection.storage
		if (storage)
			storage.setItem(accountId, key)
	}
	static readonly keyChanged: ((user: authly.Token | undefined) => void)[] = []
	static reauthenticate?: () => Promise<[User, authly.Token] | gracely.Error>
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}
	private static clear() {
		Connection.user = undefined
		Connection.key = undefined
	}
	static logout() {
		Connection.clear()
		Connection.getToken() // Triggers reauthenticate
	}
	static async login(user: string, password: string): Promise<User | gracely.Error> {
		const response = await fetch(Connection.baseUrl + "me", {
			method: "GET",
			headers: {
				Accept: "application/json; charset=utf-8",
				Authorization: Credentials.toBasic({ user, password }),
			},
		})
		const contentTypeHeader = response.headers.get("content-type")
		let result: User | gracely.Error
		switch (contentTypeHeader) {
			case "application/json; charset=utf-8":
				result = await response.json()
				break
			default:
				result = gracely.client.notFound() // TODO: local errors?
		}
		return result
	}
	private static async getToken(): Promise<authly.Token | undefined> {
		let result: authly.Token | undefined = Connection.key
		if (!result && Connection.reauthenticate) {
			const response = await Connection.reauthenticate()
			if (!gracely.Error.is(response)) {
				Connection.user = response[0]
				Connection.key = response[1]
				result = response[1]
			}
		}
		return result
	}
	private static async fetch<T>(
		resource: string,
		init: RequestInit,
		body?: any
	): Promise<T | authly.Token | gracely.Error> {
		const url = Connection.baseUrl + resource
		if (body)
			init.body = JSON.stringify(body)
		init = {
			...init,
			headers: {
				...init.headers,
				"Content-Type": "application/json; charset=utf-8",
				Accept: "application/json; charset=utf-8",
				Authorization: `Bearer ${await Connection.getToken()}`,
			},
		}
		const response = await fetch(url, init)
		let result: T | authly.Token | gracely.Error
		if (response.status == 401) {
			Connection.clear()
			result = await Connection.fetch(resource, init, body)
		} else
			result =
				response.headers.get("Content-Type") == "application/json; charset=utf-8"
					? ((await response.json()) as T | gracely.Error)
					: response.headers.get("Content-Type") == "application/jwt; charset=utf-8"
					? ((await response.text()) as authly.Token)
					: { status: response.status, type: "unknown" }
		return result
	}
	static get<T>(resource: string): Promise<T | authly.Token | gracely.Error> {
		return Connection.fetch<T>(resource, { method: "GET" })
	}
	static put<T>(resource: string, body: any): Promise<T | authly.Token | gracely.Error> {
		return Connection.fetch<T>(resource, { method: "PUT" }, body)
	}
	static post<T>(resource: string, body: any): Promise<T | authly.Token | gracely.Error> {
		return Connection.fetch<T>(resource, { method: "POST" }, body)
	}
	static patch<T>(resource: string, body: any): Promise<T | authly.Token | gracely.Error> {
		return Connection.fetch<T>(resource, { method: "PATCH" }, body)
	}
	static delete<T>(resource: string): Promise<T | authly.Token | gracely.Error> {
		return Connection.fetch(resource, { method: "DELETE" })
	}
	static options<T>(resource: string): Promise<T | authly.Token | gracely.Error> {
		return Connection.fetch(resource, { method: "OPTIONS" })
	}
}
