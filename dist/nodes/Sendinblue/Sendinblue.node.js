"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SibApiV3Sdk = require('sib-api-v3-sdk');
class Sendinblue {
    constructor() {
        this.description = {
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
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const credentials = this.getCredentials('sendinblueApi');
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = credentials['apiKey'];
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        if (resource === 'member') {
            if (operation === 'create') {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i].json;
                    const createContact = new SibApiV3Sdk.CreateContact();
                    const itemStr = {};
                    for (const key in item) {
                        const value = item[key];
                        if (typeof value === "string") {
                            itemStr[key] = value;
                        }
                        else if (value !== undefined && value != null) {
                            itemStr[key] = value.toString();
                        }
                    }
                    const attr = {
                        CIVILITE: itemStr['Civilité'],
                        NOM: itemStr['Nom'] || "",
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
                        const data = {
                            email: mail.toLowerCase(),
                            attributes: attr,
                            emailBlacklisted: false,
                            smsBlacklisted: false,
                            listIds: [item['ID LISTE']],
                            updateEnabled: true,
                        };
                        console.log(data);
                        await apiInstance.createContact(data);
                    }
                }
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.Sendinblue = Sendinblue;
//# sourceMappingURL=Sendinblue.node.js.map