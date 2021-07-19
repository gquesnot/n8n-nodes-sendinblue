"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendinblueApi {
    constructor() {
        this.name = 'sendinblueApi';
        this.displayName = 'Sendinblue API';
        this.documentationUrl = 'sendinblue';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.SendinblueApi = SendinblueApi;
//# sourceMappingURL=SendinblueApi.credentials.js.map