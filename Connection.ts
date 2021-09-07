import * as gracely from "gracely"
import * as authly from "authly"
import { default as fetch } from "isomorphic-fetch"

export class Connection {
	onError?: (error: gracely.Error, request: RequestInit) => Promise<boolean>
	onUnauthorized?: (connection: Connection) => Promise<boolean>
	private constructor(url: string | undefined, key: string | undefined) {
		Connection.url = url
		Connection.key = key
	}

	private async fetch<Response>(
		path: string,
		method: string,
		body?: any,
		header?: HeadersInit & { accept?: string | undefined }
	): Promise<Response | gracely.Error> {
		let result: Response | gracely.Error
		if (!Connection.url)
			result = gracely.client.notFound("No server configured.")
		else {
			const key = Connection.key
			const request: RequestInit = {
				method,
				headers: {
					"Content-Type": body ? "application/json; charset=utf-8" : "",
					authorization: key ? "Bearer " + key : "",
					...header,
					accept: (header?.accept ?? "application/json").startsWith("application/json")
						? "application/json+camelCase" + (header?.accept ?? "application/json").substring(26)
						: header?.accept ?? "",
				},
				body,
			}
			const response = await fetch(Connection.url + path, request).catch(error => console.log(error))
			result = !response
				? gracely.server.unavailable("Failed to reach server.")
				: response.status == 401 && this.onUnauthorized && (await this.onUnauthorized(this))
				? await this.fetch<Response>(path, method, body)
				: response.headers.get("Content-Type")?.startsWith("application/json")
				? await response.json()
				: await response.text()
			if (gracely.Error.is(result) && this.onError && (await this.onError(result, request)))
				result = await this.fetch(path, method, body, header)
		}
		return result
	}
	async get<Response>(path: string, header?: HeadersInit & { accept: string }): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "GET", undefined, header)
	}
	async post<Response>(
		path: string,
		request: any,
		header?: HeadersInit & { accept: string }
	): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "POST", request, header)
	}
	async put<Response>(
		path: string,
		request: any,
		header?: HeadersInit & { accept: string }
	): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PUT", request, header)
	}
	async patch<Response>(
		path: string,
		request: any,
		header?: HeadersInit & { accept: string }
	): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PATCH", request, header)
	}
	async delete<Response>(path: string, header?: HeadersInit & { accept: string }): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "DELETE", undefined, header)
	}

	private static storageValue: Storage | undefined | null = null
	static get storage(): Storage | undefined {
		if (this.storageValue == null) {
			const date = new Date().toUTCString()
			let result: Storage | undefined
			if (typeof window == "object" && typeof window.localStorage == "object") {
				const storage = window.localStorage
				storage.setItem("test", date)
				if (storage.getItem("test") == date)
					result = storage
				storage.removeItem("test")
			} else {
				console.log("window.localStorage does not exist")
			}
			this.storageValue = result
		}
		return this.storageValue
	}
	private static urlValue: string | undefined
	static get url(): string | undefined {
		const storage = Connection.storage
		storage && (Connection.urlValue = storage.getItem("Intergiro baseUrl") ?? undefined)
		return Connection.urlValue ?? "/"
	}
	static set url(value: string | undefined) {
		value = value?.endsWith("/") ? value : value + "/"
		const storage = Connection.storage
		if (storage)
			value ? storage.setItem("Intergiro baseUrl", value) : storage.removeItem("Intergiro baseUrl")
		Connection.urlValue = value
	}
	private static keyValue: string | undefined
	static get key(): string | undefined {
		const storage = Connection.storage
		storage && (Connection.keyValue = storage.getItem("Intergiro key") ?? "undefined")
		return Connection.keyValue
	}
	static set key(value: string | undefined) {
		const storage = Connection.storage
		if (storage)
			value ? storage.setItem("Intergiro key", value) : storage.removeItem("Intergiro key")
		Connection.keyValue = value
		Connection.keyChanged.forEach(callback => callback(Connection.keyValue))
	}
	static readonly keyChanged: ((key: authly.Token | undefined) => void)[] = []

	static open(url: string, key: string): Connection
	static open(url?: string, key?: string): Connection | undefined
	static open(url?: string, key?: string): Connection | undefined {
		return new Connection(url, key)
	}
}
