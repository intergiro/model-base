import { Base } from "./Base"

export interface Order extends Base {
	type: "order"
}

export namespace Order {
	export function is(value: Order | any): value is Order {
		return Base.is(value) && value.type == "order"
	}
}
