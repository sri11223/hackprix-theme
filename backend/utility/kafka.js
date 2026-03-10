const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'hackprix-backend',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  logLevel: logLevel.NOTHING, // Suppress KafkaJS internal logs
  retry: { retries: 1 },
});

const producer = kafka.producer();
let isConnected = false;
let connectionAttempted = false;

async function connectProducer() {
  if (isConnected) return;
  if (connectionAttempted) return; // Don't retry after first failure
  connectionAttempted = true;
  try {
    await producer.connect();
    isConnected = true;
    console.log('Kafka producer connected');
  } catch (err) {
    console.warn('Kafka not available - events will be skipped');
  }
}

async function sendEvent(topic, event) {
  try {
    if (!isConnected && connectionAttempted) return; // Skip silently
    await connectProducer();
    if (!isConnected) return;
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify({ ...event, timestamp: new Date().toISOString() }) }]
    });
  } catch (err) {
    // Silent - Kafka is optional
  }
}

async function sendUserRegisteredEvent(user) {
  await sendEvent('user-registrations', {
    event: 'USER_REGISTERED',
    userId: user.userId || user._id,
    email: user.email,
    userType: user.userType,
  });
}

async function sendJobEvent(type, data) {
  await sendEvent('job-events', { event: type, ...data });
}

async function sendInvestmentEvent(type, data) {
  await sendEvent('investment-events', { event: type, ...data });
}

async function sendNotificationEvent(data) {
  await sendEvent('notifications', { event: 'NOTIFICATION', ...data });
}

module.exports = {
  sendUserRegisteredEvent,
  sendJobEvent,
  sendInvestmentEvent,
  sendNotificationEvent,
};