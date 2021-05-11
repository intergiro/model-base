import * as langly from "langly"
import { PaymentVerifier } from "../PaymentVerifier"
import * as translation from "./translation"

const isCardVerificationError = PaymentVerifier.Response.VerificationRequired.isCardVerificationError
const isVerificationError = PaymentVerifier.Response.VerificationRequired.isVerificationError

export class ErrorMessage {
	private constructor(private type: "account" | "payment", private t: langly.Translate) {}

	private getTypeSpecificMessage() {
		return this.type == "account"
			? this.t("The account could not be created.")
			: this.t("The payment could not be completed.")
	}
	generate(input: any): string | undefined {
		const event = !input.detail
			? { detail: input }
			: input.detail.value
			? { ...input, detail: input.detail.value }
			: input
		const t = this.t
		let message: string | undefined
		const content = event && event.detail && event.detail.content ? event.detail.content : undefined
		if (this.type == "payment" && !content && !(event.detail.backend && event.detail.details))
			message = event.detail.property && event.detail.property == "noPayment" ? event.detail.description : this.unknown
		else if (
			(content && content.property == "pares" && content.url) ||
			isCardVerificationError(event.detail) ||
			isVerificationError(input)
		)
			console.log("Pares fetched, ignoring error message.")
		else if (!content && (event.detail.type == "invalid content" || event.detail.type == "malformed content"))
			message = this.unknown
		else {
			switch (event.detail.type) {
				case "invalid content":
					switch (content.description) {
						case "Body must contain a model.Card.Creatable when using method PUT.":
							message = t("Invalid Expire date.")
							break
						case "Content must be a createable card.":
						case "General input error.":
							message = t("The card details are incorrect. Please enter valid card details and try again.")
							break
						case "Invalid transaction.":
							message = t("The transaction contains incorrect information.") + " " + this.getTypeSpecificMessage()
							break
						case "Acquirer rule violation.":
							message = t("The Card Network (Acquirer) rules are not met.") + " " + this.getTypeSpecificMessage()
							break
						case "3-D Secure authentication failure.":
							message = t("3D secure failed authentication. Please try again.")
							break
						case "Elements failed validation":
							message = t("The card number is invalid. Please enter a valid number.")
							break
						default:
							message = this.unknown
							break
					}
					break
				case "malformed content":
					switch (content.property) {
						case "card.csc":
							message = t("Invalid CVC code.")
							break
						case "card.expires":
							message = t("Invalid Expire date.")
							break
						case "currency":
							message = t("Invalid currency.") + " " + this.getTypeSpecificMessage()
							break
						case "descriptor":
						case "description":
							message = t("The transaction contains incorrect statement text and could not be completed.")
							break
						case "amount":
							message =
								content.description == "Insufficient funds."
									? t("There is insufficient funds on the card.") + " " + this.getTypeSpecificMessage()
									: t("The amount limit is exceeded.") + " " + this.getTypeSpecificMessage()
							break
						case "card.pan":
							switch (content.description) {
								case "Invalid card number.":
									message = t("The card number is invalid. Please enter a valid number.")
									break
								case "Unsupported card scheme.":
									message = t("Your card is not supported. Please try another card.")
									break
								case "Not enrolled.":
									message = t("Your card doesn't support required 3D secure verification. Please try another card.")
									break
								case "Card expired.":
									message = t("Your card has expired.") + " " + this.getTypeSpecificMessage()
									break
								case "Declined by issuer or card scheme.":
									message = t("Your card was declined.") + " " + this.getTypeSpecificMessage()
									break
								case "Card restricted.":
									message = t("Your card is restricted.") + " " + this.getTypeSpecificMessage()
									break
								case "Card lost or stolen.":
									message = t("Your card has been reported lost or stolen.") + " " + this.getTypeSpecificMessage()
									break
								case "Suspected fraud.":
									message = t("Your card was declined due to suspected fraud.") + " " + this.getTypeSpecificMessage()
									break
								case "Merchant blocked by cardholder.":
									message = t("The cardholder has blocked this merchant from using the card.")
									break
								default:
									message = this.unknown
									break
							}
							break
						case "pares":
						case "card.pares":
						case "Card.Token":
						case "verification":
						case "card.verification":
							if (!content.url && !content?.details?.url)
								message =
									content.description == "3-D Secure problem."
										? t("3D secure reported an issue. Please try again.")
										: t("3D secure failed authentication. Please try again.")
							break
						default:
							message = this.unknown
							break
					}
					break
				case "backend failure":
					const details = event.detail.details
					if (!details)
						message = this.unknown
					else if (typeof details == "string") {
						switch (details) {
							case "Acquirer backend problem.":
								message = t("A Card Network (Acquirer) problem occured.") + " " + this.getTypeSpecificMessage()
								break
							case "Unknown acquirer error.":
								message =
									t("An unknown Card Network (Acquirer) error occured, possibly due to connection issues.") +
									" " +
									this.getTypeSpecificMessage()
								break
							default:
								message = details.startsWith("Unknown acquirer problem")
									? t(
											"Additional authentication required. The Card Network (Acquirer) configuration might be incorrect."
									  )
									: this.unknown
								break
						}
					} else if (typeof details == "object" && details.body?.status?.code == 40000)
						message =
							details.body?.status?.message &&
							typeof details.body.status.message == "string" &&
							(details.body.status.message as string).includes("pan")
								? t("The card number is invalid. Please enter a valid number.")
								: t("The card details are incorrect. Please enter valid card details and try again.")
					else
						message = this.unknown
					break
				case "invalid path argument":
					switch (content.argument?.description ?? "") {
						case "Parameter must be a valid card token.":
							message = t("The card details are incorrect. Please enter valid card details and try again.")
							break
						default:
							message = this.unknown
							break
					}
					break
				case "unknown error":
					message =
						event.detail.error && event.detail.error.code == "50092"
							? t("The card details are incorrect. Please enter valid card details and try again.")
							: this.unknown
					break
				default:
					message = this.unknown
					break
			}
		}
		return message
	}
	get unknown(): string {
		return this.t("An unknown error occured. Ensure that your card details are correct and try again.")
	}
	static create(type: "account" | "payment", element: HTMLElement) {
		const t = translation.create(element)
		return new ErrorMessage(type, t)
	}
}
