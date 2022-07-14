import * as gracely from "gracely"
import * as authly from "authly"
import "isomorphic-fetch"
import { Storage } from "./Storage"

export class Connection {
	onError?: (error: gracely.Error, request: RequestInit) => Promise<boolean>
	onUnauthorized?: (connection: Connection) => Promise<boolean>
	readonly continuation: Record<string, string | undefined> = {}
	private constructor(url: string | undefined, key: string | undefined) {
		Connection.url = url
		Connection.key = key
	}

	public async fetchRaw(
		path: string,
		method: string,
		body?: any,
		header?: HeadersInit & { accept?: string | undefined },
		continuationName?: string,
		continuation?: boolean
	): Promise<globalThis.Response | gracely.Error> {
		let result: globalThis.Response | gracely.Error
		if (!Connection.url)
			result = gracely.client.notFound("No server configured.")
		else if (continuationName && continuation && this.continuation[continuationName] == "done")
			result = new Response(JSON.stringify([]))
		else {
			const request: RequestInit = this.createRequest(method, body, header)
			path = this.appendContinuationToken(path, continuationName, continuation)
			try {
				result = await fetch(Connection.url + path, request)
			} catch (error) {
				console.log(error)
				result = gracely.server.unavailable("Failed to reach server.")
			}
		}
		return result
	}

	private async fetch<Response>(
		path: string,
		method: string,
		body?: any,
		header?: HeadersInit & { accept?: string | undefined },
		continuationName?: string,
		continuation?: boolean
	): Promise<Response | gracely.Error> {
		let result: Response | gracely.Error
		const request: RequestInit = this.createRequest(method, body, header)
		const response = await this.fetchRaw(path, method, body, header, continuationName, continuation)
		if (gracely.Error.is(response))
			result = response
		else {
			path = this.appendContinuationToken(path, continuationName, continuation)
			continuationName &&
				response &&
				(this.continuation[continuationName] = response.headers.get("x-ms-continuation") ?? "done")
			result = !response
				? gracely.server.unavailable("Failed to reach server.")
				: response.status == 401 && this.onUnauthorized && (await this.onUnauthorized(this))
				? await this.fetch<Response>(path, method, body)
				: response.headers.get("Content-Type")?.startsWith("application/json")
				? await response.json()
				: response.status >= 400 && response.headers.get("Content-Type")
				? gracely.server.unknown(await response.text())
				: response.headers.get("Content-Type")
				? await response.text()
				: this.handleNoContentResponses(response)
			if (gracely.Error.is(result) && this.onError && (await this.onError(result, request)))
				result = await this.fetch(path, method, body, header)
		}
		return result
	}
	private createRequest(
		method: string,
		body: any,
		header: (HeadersInit & { accept?: string | undefined }) | undefined
	): RequestInit {
		const key = Connection.key
		return {
			method,
			headers: {
				"Content-Type": body ? "application/json; charset=utf-8" : "*/*",
				authorization: !key ? "" : key.startsWith("Basic ") || key.startsWith("Bearer ") ? key : "Bearer " + key,
				...header,
				accept: (header?.accept ?? "application/json").startsWith("application/json")
					? "application/json+camelCase" + (header?.accept ?? "application/json").substring(26)
					: header?.accept ?? "",
			},
			body: body ? JSON.stringify(body) : undefined,
		}
	}

	private appendContinuationToken(
		path: string,
		continuationName: string | undefined,
		continuation: boolean | undefined
	): string {
		return (
			path +
			(continuationName && this.continuation[continuationName] && continuation
				? (path.includes("?") ? "&" : "?") +
				  `continuation=${encodeURIComponent(this.continuation[continuationName] ?? "")}`
				: "")
		)
	}
	async get<Response>(
		path: string,
		header?: HeadersInit & { accept?: string | undefined },
		continuationName?: string,
		continuation?: boolean
	): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "GET", undefined, header, continuationName, continuation)
	}
	async post<Response>(
		path: string,
		request: any,
		header?: HeadersInit & { accept?: string | undefined }
	): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "POST", request, header)
	}
	async put<Response>(
		path: string,
		request: any,
		header?: HeadersInit & { accept?: string | undefined }
	): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PUT", request, header)
	}
	async patch<Response>(
		path: string,
		request: any,
		header?: HeadersInit & { accept?: string | undefined }
	): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PATCH", request, header)
	}
	async delete<Response>(
		path: string,
		header?: HeadersInit & { accept?: string | undefined }
	): Promise<Response | gracely.Error> {
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
			}
			this.storageValue = result
		}
		return this.storageValue
	}

	static get app(): string | undefined {
		const path = window.location.pathname.split("/").filter(p => !!p)
		let result = "intergiro"
		if (path.length > 0)
			result = ["monitor", "portal", "customer"].includes(path[0]) ? path[0] : result
		return result
	}

	private static urlValue: string | undefined
	static get url(): string | undefined {
		const storage = Connection.storage
		storage && (Connection.urlValue = storage.getItem(Connection.app + " baseUrl") ?? undefined)
		return Connection.urlValue
	}
	static set url(value: string | undefined) {
		value = value?.endsWith("/") || !value ? value : value + "/"
		const storage = Connection.storage
		if (storage)
			value ? storage.setItem(Connection.app + " baseUrl", value) : storage.removeItem(Connection.app + " baseUrl")
		Connection.urlValue = value
	}

	private static keyValue: string | undefined
	static get key(): string | undefined {
		const storage = Connection.storage
		storage && (Connection.keyValue = storage.getItem(Connection.app + " key") ?? undefined)
		return Connection.keyValue
	}
	static set key(value: string | undefined) {
		const storage = Connection.storage
		if (storage)
			value ? storage.setItem(Connection.app + " key", value) : storage.removeItem(Connection.app + " key")
		Connection.keyValue = value
		Connection.keyChanged.forEach(callback => callback(Connection.keyValue))
	}
	static readonly keyChanged: ((key: authly.Token | undefined) => void)[] = []
	private handleNoContentResponses<ReturnType>(response: Response): ReturnType | gracely.Result {
		let result: ReturnType | gracely.Result
		switch (response.status) {
			case 404:
				result = gracely.client.notFound()
				break
			case 204:
				result = gracely.success.noContent()
				break
			default:
				result = gracely.server.unknown("Unknown or missing response type.")
				break
		}
		return result
	}
	static open(url: string, key: string): Connection
	static open(url?: string, key?: string): Connection | undefined
	static open(url?: string, key?: string): Connection | undefined {
		return new Connection(url, key)
	}
}
