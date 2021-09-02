import {
	ICredentialType, INodeProperties,
	NodePropertyTypes,
} from 'n8n-workflow';





export class SendinblueApi implements ICredentialType {
	name = 'sendinblueApi';
	displayName = 'Sendinblue API';
	documentationUrl = 'sendinblue';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
	];
}



