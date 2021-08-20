import * as gracely from "gracely"

interface Header {
	accept?: "application/pdf" | "text/html"
}
export class Connection {
	private constructor(readonly url: string, readonly token: string) {}

	async fetch<Response>(
		path: string,
		method: string,
		request?: any,
		tokenize?: true,
		header?: Header
	): Promise<Response | gracely.Error> {
		const response = await fetch(`${this.url}/${path}`, {
			method,
			headers: {
				Accept: header?.accept ?? (tokenize ? "application/jwt" : "application/json") + "+camelCase",
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${this.token}`,
			},
			body: JSON.stringify(request),
		}).catch(_ => undefined)
		return !response
			? gracely.server.unavailable()
			: response.headers.get("Content-Type")?.startsWith("application/json")
			? response.json()
			: response.text()
	}
	async get<Response>(path: string, header?: Header): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "GET", undefined, undefined, header)
	}
	async patch<Response>(path: string, request: any, header?: Header): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PATCH", request, undefined, header)
	}
	async post<Response>(
		path: string,
		request: any,
		tokenize?: true,
		header?: Header
	): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "POST", request, tokenize, header)
	}
	async put<Response>(path: string, request: any, header?: Header): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PUT", request, undefined, header)
	}
	async remove<Response>(path: string): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "DELETE")
	}
	static open(url: string | undefined, token: string | undefined): Connection | undefined {
		return token && url ? new Connection(url, token) : undefined
	}
}
