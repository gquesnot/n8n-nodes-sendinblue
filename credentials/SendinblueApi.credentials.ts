import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';





export class SendinblueApi implements ICredentialType {
	name = 'sendinblueApi';
	displayName = 'Sendinblue API';
	documentationUrl = 'sendinblue';
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}



