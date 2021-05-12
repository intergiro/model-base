export interface DE {
	street: string
	zipCode: string
	city: string
	state?: DE.State | string
	countryCode: "DE"
}
export namespace DE {
	export function is(value: any | DE): value is DE {
		return (
			typeof value == "object" &&
			typeof value.street == "string" &&
			typeof value.zipCode == "string" &&
			typeof value.city == "string" &&
			(DE.State.is(value.state) || typeof value.state == "string") &&
			value.countryCode == "DE"
		)
	}
	export function create(): DE {
		return { street: "", zipCode: "", city: "", countryCode: "DE" }
	}
	export type State =
		| "Baden-Württemberg"
		| "Bayern"
		| "Berlin"
		| "Brandenburg"
		| "Bremen"
		| "Hamburg"
		| "Hessen"
		| "Mecklenburg-Vorpommern"
		| "Niedersachsen"
		| "Nordrhein-Westfalen"
		| "Rheinland-Pfalz"
		| "Saarland"
		| "Sachsen"
		| "Sachsen-Anhalt"
		| "Schleswig-Holstein"
		| "Thüringen"
	export namespace State {
		export const types: State[] = [
			"Baden-Württemberg",
			"Bayern",
			"Berlin",
			"Brandenburg",
			"Bremen",
			"Hamburg",
			"Hessen",
			"Mecklenburg-Vorpommern",
			"Niedersachsen",
			"Nordrhein-Westfalen",
			"Rheinland-Pfalz",
			"Saarland",
			"Sachsen",
			"Sachsen-Anhalt",
			"Schleswig-Holstein",
			"Thüringen",
		]
		export function is(value: State | any): value is State {
			return types.some(v => v == value)
		}
		const fromEnglish: { [name: string]: State | undefined } = {
			"baden-württemberg": "Baden-Württemberg",
			bavaria: "Bayern",
			berlin: "Berlin",
			brandenburg: "Brandenburg",
			bremen: "Bremen",
			hamburg: "Hamburg",
			hesse: "Hessen",
			"mecklenburg-vorpommern": "Mecklenburg-Vorpommern",
			"lower saxony": "Niedersachsen",
			"north rhine-westphalia": "Nordrhein-Westfalen",
			"rhineland-palatinate": "Rheinland-Pfalz",
			saarland: "Saarland",
			saxony: "Sachsen",
			"saxony-anhalt": "Sachsen-Anhalt",
			"schleswig-holstein": "Schleswig-Holstein",
			thuringia: "Thüringen",
		}
		export function parse(value: string): State | string {
			const lower = value.toLocaleLowerCase()
			return types.find(s => s.toLocaleLowerCase() == lower) ?? fromEnglish[lower] ?? value
		}
	}
}
