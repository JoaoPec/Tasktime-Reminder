import twilio from 'twilio';
import { accountSid, authToken } from './config.js'; // Certifique-se de que config.js contenha suas credenciais


function initializeTwilioClient() {
    return twilio(accountSid, authToken);
}

export default initializeTwilioClient;

