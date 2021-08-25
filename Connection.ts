import * as gracely from "gracely"
import { default as fetch } from "isomorphic-fetch"

type Accept = "jwt" | "json" | "pdf" | "html"

export class Connection {
	private constructor(readonly url: string, readonly token: string) {}

	async fetch<Response>(
		path: string,
		method: string,
		request?: any,
		accept: Accept = "json"
	): Promise<Response | gracely.Error> {
		const response = await fetch(`${this.url}/${path}`, {
			method,
			headers: {
				Accept:
					{ jwt: "application/jwt", json: "application/json", pdf: "application/pdf", html: "text/html" }[accept] +
					"+camelCase",
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
	async get<Response>(path: string, accept?: Accept): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "GET", undefined, accept)
	}
	async patch<Response>(path: string, request: any, accept?: Accept): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PATCH", request, accept)
	}
	async post<Response>(path: string, request: any, accept?: Accept): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "POST", request, accept)
	}
	async put<Response>(path: string, request: any, accept?: Accept): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PUT", request, accept)
	}
	async remove<Response>(path: string, accept?: Accept): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "DELETE", undefined, accept)
	}
	static open(url: string | undefined, token: string | undefined): Connection | undefined {
		return token && url ? new Connection(url, token) : undefined
	}
}
