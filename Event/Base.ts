import * as isoly from "isoly"
import { Item } from "../Item"
import { Type } from "./Type"

export interface Base {
	type: Type
	reference?: string
	date: isoly.DateTime
	items?: number | Item | Item[]
}
export namespace Base {
	export function is(value: Base | any): value is Base & any {
		return (
			typeof value == "object" &&
			(value.reference == undefined || typeof value.reference == "string") &&
			isoly.DateTime.is(value.date) &&
			(value.items == undefined || Item.canBe(value.items))
		)
	}
}
