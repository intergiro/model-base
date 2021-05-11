import * as authly from "authly"

export interface Credentials {
	user: string
	password?: string
}
export namespace Credentials {
	export function is(value: any | Credentials): value is Credentials {
		return (
			typeof value == "object" &&
			typeof value.user == "string" &&
			value.user != "" &&
			(value.password == undefined || typeof value.password == "string")
		)
	}
	export function fromBasic(login: string | undefined): Credentials | undefined {
		let result: Credentials | undefined
		if (login && login.substr(0, 6).toLowerCase() == "basic ") {
			const data = new authly.TextDecoder().decode(authly.Base64.decode(login.substr(6), "standard")).split(":")
			result =
				data.length < 3 && data.length > 0
					? { user: data[0], password: data.length > 1 ? data[1] : undefined }
					: undefined
		}
		return result
	}
	export function toBasic(credentials: Credentials): string {
		return `Basic ${authly.Base64.encode(
			new authly.TextEncoder().encode(credentials.user + ":" + credentials.password),
			"standard",
			"="
		)}`
	}
}
