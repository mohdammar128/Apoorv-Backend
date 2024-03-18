const admin = require("../config/firebaseCofig");
const messaging = admin.messaging();

const sendNotification = async (message) => {
  const allUsersTopic = 'all_users'; // Replace with your topic name

  const messageObject = {
    notification: {
      title: message.title, // Use the title from the feed
      body: message.text, // Use the text from the feed as the body of the notification
    },
    android: {
      priority: 'high', // Set priority for Android devices (optional)
    },
    // Optionally include iOS specific notification data here
    topic: allUsersTopic, // Add the topic here
  };

  // If message.imageUrl is defined, add it as the image of the notification
  if (message.imageUrl) {
    messageObject.notification.image = message.imageUrl;
  }

  try {
    const response = await messaging.send(messageObject);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.log('Error sending message:', error);
  }
};
module.exports = { sendNotification };