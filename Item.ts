import * as gracely from "gracely"

export interface Item {
	number?: string
	name?: string
	price?: number
	quantity?: number
	unit?: string
	vat?: number
	rebate?: number
}
export namespace Item {
	export function is(value: Item | any): value is Item {
		return (
			typeof value == "object" &&
			(typeof value.number == "string" || value.number == undefined) &&
			(typeof value.name == "string" || value.name == undefined) &&
			(typeof value.price == "number" || value.price == undefined) &&
			(typeof value.quantity == "number" || value.quantity == undefined) &&
			(typeof value.unit == "string" || value.unit == undefined) &&
			((typeof value.vat == "number" && typeof value.price == "number") || value.vat == undefined) &&
			(typeof value.rebate == "number" || value.rebate == undefined)
		)
	}
	export function flaw(value: Item | any): gracely.Flaw {
		return {
			type: "model.Item",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							typeof value.number == "string" || value.number == undefined || { property: "number", type: "string" },
							typeof value.name == "string" || value.name == undefined || { property: "name", type: "string" },
							typeof value.price == "number" || value.price == undefined || { property: "price", type: "number" },
							typeof value.quantity == "number" ||
								value.quantity == undefined || { property: "quantity", type: "number" },
							typeof value.unit == "string" || value.unit == undefined || { property: "unit", type: "string" },
							(typeof value.vat == "number" && typeof value.price == "number") ||
								value.vat == undefined || { property: "vat", type: "number" },
							typeof value.rebate == "number" || value.rebate == undefined || { property: "rebate", type: "number" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export function canBe(value: number | Item | Item[] | any): value is number | Item | Item[] {
		return typeof value == "number" || Item.is(value) || (Array.isArray(value) && value.every(Item.is))
	}
	export function canBeFlaw(value: number | Item | Item[] | any): gracely.Flaw | gracely.Flaw[] {
		let result: gracely.Flaw | gracely.Flaw[]
		if (Array.isArray(value)) {
			const array: gracely.Flaw[] = []
			value.forEach(item => {
				array.push(flaw(item))
			})
			result = array
		} else
			result = flaw(value)
		return result
	}
	export function amount(item: number | Item | Item[]): number {
		return typeof item == "number"
			? item
			: Array.isArray(item)
			? item.map(i => amount(i)).reduce((sum, current) => sum + current, 0)
			: Item.is(item) && item.price
			? (item.price - (item.rebate || 0) + (item.vat || 0)) * (item.quantity || 1)
			: 0
	}
	export function fromVatInclusivePrice(
		total: number,
		vatAsPercentage?: number,
		itemNumber?: string,
		name?: string,
		quantity?: number,
		unit?: string,
		rebate?: number
	): Item {
		return {
			number: itemNumber,
			name,
			price: total / (1 + (vatAsPercentage || 0)),
			quantity,
			unit,
			vat: vatAsPercentage ? total - total / (1 + vatAsPercentage) : undefined,
			rebate,
		}
	}
	export function vat(item: number | Item | Item[]): number | undefined {
		return typeof item == "number"
			? undefined
			: Array.isArray(item)
			? item.map(i => vat(i)).reduce((sum, current) => (!current ? sum : current + (sum || 0)), undefined)
			: !Item.is(item)
			? undefined
			: !item.vat
			? undefined
			: item.vat * (item.quantity || 1)
	}
	export function asArray(items: number | Item | Item[]): Item[] {
		return Array.isArray(items) ? items : typeof items == "number" ? [{ price: items }] : [items]
	}
	export function equals(left: Item, right: Item) {
		return (
			left.number == right.number &&
			left.name == right.name &&
			left.price == right.price &&
			left.unit == right.unit &&
			left.vat == right.vat &&
			left.rebate == right.rebate
		)
	}
	export function getCsvHeaders(): string {
		return `item count, item amount`
	}
	export function toCsv(value: number | Item | Item[]): string {
		let result = ``
		if (typeof value == "number")
			result += `0,` + Item.amount(value).toString()
		else if (!Array.isArray(value))
			result += `1,` + Item.amount(value).toString()
		else
			result += value.length.toString() + `,` + Item.amount(value)
		return result
	}
}
