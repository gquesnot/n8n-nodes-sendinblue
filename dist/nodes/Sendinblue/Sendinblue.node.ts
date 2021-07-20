import {IExecuteFunctions,} from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';




// tslint:disable-next-line:variable-name
const SibApiV3Sdk = require('sib-api-v3-sdk');

function getClient(parent: IExecuteFunctions| ILoadOptionsFunctions){
	const credentials = parent.getCredentials('sendinblueApi') as IDataObject;
	const defaultClient = SibApiV3Sdk.ApiClient.instance;
	const apiKey = defaultClient.authentications['api-key'];
	apiKey.apiKey = credentials['apiKey'];

	return new SibApiV3Sdk.ContactsApi();
}

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
			{
				displayName: 'List ID',
				name: 'listId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getLists',
				},
				default: 'aucune',
				options: [{name:'aucune', value: "-1"}],
				description: 'List of lists',
				required:true,
			},
		],
	};
	methods = {
		loadOptions: {

			// Get all the available lists to display them to user so that he can
			// select them easily
			async getLists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [{name:"aucune", value:"-1"}];
				const apiInstance = getClient(this);

				const lists = await apiInstance.getLists();
				const tmpList = lists['lists'];
				//const lists = await mailchimpApiRequestAllItems.call(this, '/lists', 'GET', 'lists');
				for (const list of tmpList) {
					const listName = list.name;
					const listId = list.id;
					returnData.push({
						name: listName,
						value: listId,
					});
				}
				return returnData;
			}
		}
	};



	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData :IDataObject[] = [];
		const apiInstance = getClient(this);

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const listId = this.getNodeParameter('listId', 0) as string;
		//Get credentials the user provided for this node


		const listIdNumber = parseInt(listId,10);
		if (isNaN(listIdNumber)){
			return [this.helpers.returnJsonArray(returnData)];
		}
		if (resource === 'member' && operation === 'create') {
			for (let i = 0; i < items.length; i++) {
				const item = items[i].json;
				const createContact = new SibApiV3Sdk.CreateContact();

				interface StringMap {
					[key: string]: string;
				}

				interface NumberMap {
					[key: string]: number;
				}

				// tslint:disable-next-line:no-any
				interface MyDictionary {
					// tslint:disable-next-line:no-any
					[index: string]: any;
				}

				const itemStr: MyDictionary = {};

				// tslint:disable-next-line:forin
				for (const key in item) {
					const value = item[key];
					if (typeof value === "string") {
						itemStr[key] = value;
					} else if (value !== undefined && value !== null) {
						itemStr[key] = value.toString();
					}

				}
				//map attr
				const attr: StringMap = {
					CIVILITE: itemStr['Civilité'],
					NOM: itemStr['Nom'] ? itemStr['Nom'] : "",
					PRENOM: itemStr['Prénom'],
					VILLE: itemStr['Ville'],
					CODEPOSTAL: itemStr['Code Postal'],
					ADRESSE: itemStr['Adresse 1'],
					TELEPHONE: itemStr['Tel Fixe'],
					PORTABLE: itemStr['tel Portable'],
					BOUTIQUE: itemStr['Je suis la boutique de'],
				};
				const mail = item['Mail'];
				if (typeof mail === "string") {
					if (mail === "") {
						continue;
					}
					//request data
					const data = {
						email: mail.toLowerCase(),
						attributes: attr,
						emailBlacklisted: false,
						smsBlacklisted: false,
						listIds: [listIdNumber === -1 ? item['ID LISTE'] : listIdNumber],
						updateEnabled: true,
					};
					await apiInstance.createContact(data);
					const resData = attr;
					// @ts-ignore
					resData.listIds = data.listIds;
					resData.email = data.email;
					returnData.push(resData);
				}
			}
		}
		// Map data to n8n data
		return [this.helpers.returnJsonArray(returnData)];
	}

}
