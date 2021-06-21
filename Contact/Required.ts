export interface Required {
	phone?: boolean
	email?: boolean
	zip?: boolean
}
export namespace Required {
	export function is(value: any | Required): value is Required {
		return (
			typeof value == "object" &&
			(typeof value.phone == "boolean" || value.phone == undefined) &&
			(typeof value.email == "boolean" || value.email == undefined) &&
			(typeof value.zip == "boolean" || value.zip == undefined) &&
			(value.phone || value.email || value.zip || Object.keys(value).length == 0)
		)
	}
}
