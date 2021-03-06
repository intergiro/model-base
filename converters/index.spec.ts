import { defaultExceptions } from "./defaultExceptions"
import { toCamel } from "./toCamel"
import { toSnake } from "./toSnake"

describe("IntergiroConverter", () => {
	it("CT Basic order create test", () => {
		const order = {
			id: "1234",
			number: "1234",
			items: 5,
			currency: "SEK",
			customer: { number: "CT Basic Library Code", phone: "", email: "" },
			meta: {
				ct: {
					algorithm: "sha256",
					merchantid: "12345",
					return_url: "https://merchant.com/return.php",
					callback_url: "https://merchant.com/callback.php",
				},
			},
			callback: "http://api.url/ctpsp/basic/callback",
			category: "purchase",
			to_camel_case_example: "order except for meta",
			payment: {
				type: "card",
				card: "eyJ.eyJ.signature",
				client: {
					browser: {
						colorDepth: 24,
						resolution: [2560, 1440],
						java: false,
						javascript: true,
						locale: "sv-SE",
						timezone: -120,
						parent: "https://merchant.com/ui/webshop",
					},
				},
			},
		}
		const convertedOrder = toCamel(order)
		expect(convertedOrder.meta).toEqual({
			ct: {
				algorithm: "sha256",
				callback_url: "https://merchant.com/callback.php",
				merchantid: "12345",
				return_url: "https://merchant.com/return.php",
			},
		})
		expect(convertedOrder.to_camel_case_example).toBeUndefined()
		expect(convertedOrder.toCamelCaseExample).toEqual("order except for meta")
		const inOrderList: any[] = toCamel([order])
		expect(inOrderList[0].meta).toEqual({
			ct: {
				algorithm: "sha256",
				callback_url: "https://merchant.com/callback.php",
				merchantid: "12345",
				return_url: "https://merchant.com/return.php",
			},
		})
		expect(inOrderList[0].to_camel_case_example).toBeUndefined()
		expect(inOrderList[0].toCamelCaseExample).toEqual("order except for meta")
	})
	it("IntergiroConverter camel to snake", () => {
		expect(toSnake([...camelCase])).toEqual(snake_case)
		expect(toCamel([...snake_case])).toEqual(camelCase)
	})
	it("IntergiroConverter camel to snake with exceptions", () => {
		expect(toSnake({ ...camelCaseWithExceptions })).toEqual({ ...snake_case_with_exceptions })
		expect(toCamel({ ...snake_case_with_exceptions })).toEqual({ ...camelCaseWithExceptions })
	})
	it("IntergiroConverter camel to snake with exceptions in a list", () => {
		expect(toSnake([{ ...camelCaseWithExceptions }])).toEqual([{ ...snake_case_with_exceptions }])
		expect(toCamel([{ ...snake_case_with_exceptions }])).toEqual([{ ...camelCaseWithExceptions }])
	})
	it("IntergiroConverter camel to snake with defaultExceptions + header/headers in a list", () => {
		const unmodifiedHeaders = toSnake([...camelCase], [...defaultExceptions, "*.header", "*.headers"])
		expect(unmodifiedHeaders).toEqual(
			snake_case.map(o => ({
				...o,
				entries: o.entries.map(o2 => ({
					...o2,
					data:
						"header" in o2.data && "headers" in o2.data
							? { ...o2.data, header: toCamel(o2.data.header), headers: toCamel(o2.data.headers) }
							: "header" in o2.data
							? { ...o2.data, header: toCamel(o2.data.header) }
							: "headers" in o2.data
							? { ...o2.data, headers: toCamel(o2.data.headers) }
							: o2.data,
				})),
			}))
		)
		expect(toCamel([...unmodifiedHeaders])).toEqual(camelCase)
	})

	const camelCaseWithExceptions = {
		threeDSServerTransID: {
			nestedContent: [{ threeDSServerTransID: "1234-1234" }],
		},
		content: {
			nestedContent: true,
			details: {
				method: "POST",
				data: {
					type: "method",
					threeDSServerTransID: "1234-1234",
					messageVersion: "2.2.0",
				},
				meta: {
					threeDSServerTransID: "meta-data",
				},
			},
			detailsData: [],
			other: false,
		},
		meta: {
			type: "method",
			threeDSServerTransID: "1234-1234",
			messageVersion: "2.2.0",
		},
		list: [
			{ otherExample: true, meta: { metaData: true }, nested: { meta: { metaData: true } } },
			{ type: "method", threeDSServerTransID: "1234-1234", messageVersion: "2.2.0" },
		],
	}

	const snake_case_with_exceptions = {
		three_d_s_server_trans_i_d: {
			nested_content: [{ three_d_s_server_trans_i_d: "1234-1234" }],
		},
		content: {
			nested_content: true,
			details: {
				method: "POST",
				data: {
					type: "method",
					threeDSServerTransID: "1234-1234",
					messageVersion: "2.2.0",
				},
				meta: {
					threeDSServerTransID: "meta-data",
				},
			},
			details_data: [],
			other: false,
		},
		meta: {
			type: "method",
			threeDSServerTransID: "1234-1234",
			messageVersion: "2.2.0",
		},
		list: [
			{ other_example: true, meta: { metaData: true }, nested: { meta: { metaData: true } } },
			{ type: "method", three_d_s_server_trans_i_d: "1234-1234", message_version: "2.2.0" },
		],
	}

	const camelCase = [
		{
			reference: {
				type: "merchant",
				id: "<redacted>",
			},
			agent: "<redacted>",
			merchant: "<redacted>",
			resource: {
				method: "POST",
				location: "https://<dev-url>/merchant",
			},
			created: "2021-07-09T08:54:48.053Z",
			entries: [
				{
					level: "trace",
					point: "request",
					data: {
						headers: {
							accept: ["*/*"],
							acceptEncoding: ["gzip"],
							authorization: "Bearer <redacted.api.key>",
							connection: "Keep-Alive",
							contentLength: "781",
							contentType: "application/json",
							host: "<dev-url>",
							userAgent: "<redacted>",
							xForwardedProto: "https",
						},
						url: "https://<dev-url>/merchant",
					},
				},
				{
					level: "trace",
					point: "response",
					data: {
						status: 200,
						header: {
							contentType: "application/json; charset=utf-8",
							accessControlAllowOrigin: "*",
						},
						body: {
							id: "<redacted>",
							number: "<redacted>",
							type: "test",
							agent: "<redacted>",
							reference: "<redacted reference number>",
							descriptor: "Upcheck Test Transactions",
							name: "Upcheck Test Merchant",
							reconciliation: {
								account: "only for testing, no account",
								fees: {
									other: {},
								},
								reserves: {
									percentage: 0,
									days: 0,
								},
							},
							country: "SE",
							categoryCode: "1234",
							rules: {
								master: [
									"reject <redacted rule>",
									"reject <redacted rule>",
									"reject <redacted rule>",
									"reject <redacted rule>",
								],
							},
							currency: "EUR",
						},
					},
				},
			],
		},
		{
			reference: {
				type: "merchant",
				id: "<redacted>",
			},
			agent: "<redacted>",
			merchant: "<redacted>",
			resource: {
				method: "PATCH",
				location: "https://<dev-url>/merchant/<redacted>",
			},
			created: "2021-07-09T08:55:45.512Z",
			entries: [
				{
					level: "trace",
					point: "request",
					data: {
						headers: {
							accept: ["*/*"],
							acceptEncoding: ["gzip"],
							authorization: "Bearer <redacted.api.key>",
							connection: "Keep-Alive",
							contentLength: "783",
							contentType: "application/json",
							host: "<dev-url>",
							userAgent: "<redacted>",
							xForwardedProto: "https",
						},
						url: "https://<dev-url>/merchant/<redacted>",
					},
				},
				{
					level: "trace",
					point: "response",
					data: {
						status: 200,
						header: {
							contentType: "application/json; charset=utf-8",
							accessControlAllowOrigin: "*",
						},
						body: {
							id: "<redacted>",
							number: "<redacted>",
							type: "test",
							agent: "<redacted>",
							reference: "<redacted reference number>",
							descriptor: "Upcheck Test Transactions",
							name: "Upcheck Test Merchant",
							reconciliation: {
								account: "only for testing, no account",
								fees: {
									other: {},
								},
								reserves: {
									percentage: 1.5,
									days: 1,
								},
							},
							country: "SE",
							categoryCode: "1234",
							rules: {
								master: [
									"reject <redacted rule>",
									"reject <redacted rule>",
									"reject <redacted rule>",
									"reject <redacted rule>",
								],
							},
							currency: "EUR",
						},
					},
				},
			],
		},
	]

	const snake_case = [
		{
			reference: {
				type: "merchant",
				id: "<redacted>",
			},
			agent: "<redacted>",
			merchant: "<redacted>",
			resource: {
				method: "POST",
				location: "https://<dev-url>/merchant",
			},
			created: "2021-07-09T08:54:48.053Z",
			entries: [
				{
					level: "trace",
					point: "request",
					data: {
						headers: {
							accept: ["*/*"],
							accept_encoding: ["gzip"],
							authorization: "Bearer <redacted.api.key>",
							connection: "Keep-Alive",
							content_length: "781",
							content_type: "application/json",
							host: "<dev-url>",
							user_agent: "<redacted>",
							x_forwarded_proto: "https",
						},
						url: "https://<dev-url>/merchant",
					},
				},
				{
					level: "trace",
					point: "response",
					data: {
						status: 200,
						header: {
							content_type: "application/json; charset=utf-8",
							access_control_allow_origin: "*",
						},
						body: {
							id: "<redacted>",
							number: "<redacted>",
							type: "test",
							agent: "<redacted>",
							reference: "<redacted reference number>",
							descriptor: "Upcheck Test Transactions",
							name: "Upcheck Test Merchant",
							reconciliation: {
								account: "only for testing, no account",
								fees: {
									other: {},
								},
								reserves: {
									percentage: 0,
									days: 0,
								},
							},
							country: "SE",
							category_code: "1234",
							rules: {
								master: [
									"reject <redacted rule>",
									"reject <redacted rule>",
									"reject <redacted rule>",
									"reject <redacted rule>",
								],
							},
							currency: "EUR",
						},
					},
				},
			],
		},
		{
			reference: {
				type: "merchant",
				id: "<redacted>",
			},
			agent: "<redacted>",
			merchant: "<redacted>",
			resource: {
				method: "PATCH",
				location: "https://<dev-url>/merchant/<redacted>",
			},
			created: "2021-07-09T08:55:45.512Z",
			entries: [
				{
					level: "trace",
					point: "request",
					data: {
						headers: {
							accept: ["*/*"],
							accept_encoding: ["gzip"],
							authorization: "Bearer <redacted.api.key>",
							connection: "Keep-Alive",
							content_length: "783",
							content_type: "application/json",
							host: "<dev-url>",
							user_agent: "<redacted>",
							x_forwarded_proto: "https",
						},
						url: "https://<dev-url>/merchant/<redacted>",
					},
				},
				{
					level: "trace",
					point: "response",
					data: {
						status: 200,
						header: {
							content_type: "application/json; charset=utf-8",
							access_control_allow_origin: "*",
						},
						body: {
							id: "<redacted>",
							number: "<redacted>",
							type: "test",
							agent: "<redacted>",
							reference: "<redacted reference number>",
							descriptor: "Upcheck Test Transactions",
							name: "Upcheck Test Merchant",
							reconciliation: {
								account: "only for testing, no account",
								fees: {
									other: {},
								},
								reserves: {
									percentage: 1.5,
									days: 1,
								},
							},
							country: "SE",
							category_code: "1234",
							rules: {
								master: [
									"reject <redacted rule>",
									"reject <redacted rule>",
									"reject <redacted rule>",
									"reject <redacted rule>",
								],
							},
							currency: "EUR",
						},
					},
				},
			],
		},
	]
})
