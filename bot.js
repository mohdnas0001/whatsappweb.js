const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Initialize the WhatsApp client with local authentication
const client = new Client({
    authStrategy: new LocalAuth(),
});

// In-memory store to track user states
const userStates = {};

// Display QR code for authentication
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR code received, scan it with your phone.');
});

// Log when the client is ready
client.on('ready', () => {
    console.log('Client is ready!');
});

// Respond to incoming messages
client.on('message', message => {
    const userId = message.from; // User's WhatsApp ID
    console.log(`Received message from ${userId}: ${message.body}`);

    // Check if the user has sent a message before
    if (!userStates[userId]) {
        // First message
        userStates[userId] = 'initial'; // Mark user as having received the first message

        // Response for the first message
        const responseText = `Welcome to My Clothing Store! 🌟\n\nHow can I assist you today? I'm here to help with your shopping needs, whether it's finding the perfect outfit, checking product availability, or answering any other questions you may have.`;

        // Send the response
        message.reply(responseText);
    } else {
        // Subsequent messages
        userStates[userId] = 'waitingForCustomerCare';

        // Response for subsequent messages
        const responseText = `Thank you for your message. You'll be connected with customer care shortly.\n\nPlease provide the information about the order you'd like to make, and we'll assist you further.`;

        // Send the response
        message.reply(responseText);
    }
});

// Initialize the client
client.initialize();
