import {IExecuteFunctions,} from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';


var SibApiV3Sdk = require('sib-api-v3-sdk');

export class Sendinblue implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sendinblue',
		name: 'sendinblue',
		icon: 'file:sendinblue.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume Sendinblue API',
		defaults: {
			name: 'Sendinblue',
			color: '#1A82e2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{
			name: 'sendinblueApi',
			required: true,
		}],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Member',
						value: 'member',
					}
				],
				default: 'member',
				required: true,
				description: 'Resource to consume.',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'member',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new member on list',
					},
				],
				default: 'create',
				description: 'The operation to perform.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let returnData :Array<IDataObject> = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		//Get credentials the user provided for this node
		const credentials = this.getCredentials('sendinblueApi') as IDataObject;
		const defaultClient = SibApiV3Sdk.ApiClient.instance;
		const apiKey = defaultClient.authentications['api-key'];
		apiKey.apiKey = credentials['apiKey']

		const apiInstance = new SibApiV3Sdk.ContactsApi();


		if (resource === 'member') {

			if (operation === 'create') {
				for (let i = 0; i < items.length; i++) {
					let item = items[i].json
					var createContact = new SibApiV3Sdk.CreateContact();
					interface StringMap { [key: string]: string; }
					interface numberMap {[key: string]: number}
					interface myDictionary { [index: string]: any; };

					let itemStr: myDictionary = {}

					for (let key in item) {
						let value = item[key];
						if (typeof  value == "string") {
							itemStr[key] = value
						}
						else if (value != undefined && value != null){
							itemStr[key] = value.toString()
						}

					}
					var attr: StringMap= {
						CIVILITE: itemStr['Civilité'],
						NOM: itemStr['Nom'] ?? "",
						PRENOM: itemStr['Prénom'],
						VILLE: itemStr['Ville'],
						CODEPOSTAL: itemStr['Code Postal'],
						ADRESSE: itemStr['Adresse 1'],
						TELEPHONE: itemStr['Tel Fixe'],
						PORTABLE: itemStr['tel Portable'],
						BOUTIQUE: itemStr['Je suis la boutique de'],
					}
					if (typeof item['Mail'] == "string"){
						if (item['Mail'] == ""){
							continue;
						}
						const data = {
							email: item['Mail'].toLowerCase(),
							attributes: attr,
							emailBlacklisted: false,
							smsBlacklisted: false,
							listIds: [item['ID LISTE']],
							updateEnabled: true,
						};
						console.log(data)
						await apiInstance.createContact(data)

					}




				}
			}
		}

		// Map data to n8n data
		return [this.helpers.returnJsonArray(returnData)];
	}

}