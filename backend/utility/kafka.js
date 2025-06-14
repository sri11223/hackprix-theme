const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'hackprix-backend',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

async function sendUserRegisteredEvent(user) {
  await producer.connect();
  await producer.send({
    topic: 'user-registrations',
    messages: [
      {
        value: JSON.stringify({
          event: 'USER_REGISTERED',
          userId: user._id,
          email: user.email,
          userType: user.userType,
          registeredAt: new Date().toISOString()
        })
      }
    ]
  });
  await producer.disconnect();
}

module.exports = { sendUserRegisteredEvent };