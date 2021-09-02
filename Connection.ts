import * as gracely from "gracely"

export class Connection {
	onError?: (error: gracely.Error, request: RequestInit) => Promise<boolean>
	onUnauthorized?: (connection: Connection) => Promise<boolean>
	private constructor(public url: string | undefined, public key: string | undefined) {}

	private async fetch<Response>(
		path: string,
		method: string,
		body?: any,
		header?: HeadersInit & { accept?: string | undefined }
	): Promise<Response | gracely.Error> {
		let result: Response | gracely.Error
		if (!this.url)
			result = gracely.client.notFound("No server configured.")
		else {
			const request: RequestInit = {
				method,
				headers: {
					"Content-Type": body ? "application/json; charset=utf-8" : "*/*",
					authorization: this.key ? "Bearer " + this.key : "",
					...header,
					accept: (header?.accept ?? "application/json").startsWith("application/json")
						? "application/json+camelCase" + (header?.accept ?? "application/json").substring(26)
						: "",
				},
				body: JSON.stringify(body),
			}
			const response = (await fetch(`${this.url}/${path}`, request).catch(error => console.log(error))) ?? undefined
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
	async get<Response>(
		path: string,
		header?: HeadersInit & { accept?: string | undefined }
	): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "GET", undefined, header)
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
	static open(url: string, key: string): Connection
	static open(url?: string, key?: string): Connection | undefined
	static open(url?: string, key?: string): Connection | undefined {
		return new Connection(url, key)
	}
}
