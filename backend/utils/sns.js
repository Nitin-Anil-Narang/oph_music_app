
// src/utils/sns.js
const AWS = require('aws-sdk');



const sns = new AWS.SNS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const sendEmail = async (email, content) => {
  const params = {
    Message: content.body,
    Subject: content.subject,
    TopicArn: process.env.AWS_SNS_TOPIC_ARN,
    MessageAttributes: {
      'email': {
        DataType: 'String',
        StringValue: email
      }
    }
  };

  try {
    await sns.publish(params).promise();
  } catch (error) {
    console.log('SNS email error:', error);
    throw new Error('Failed to send  email');
  }
};

module.exports = { sendEmail };