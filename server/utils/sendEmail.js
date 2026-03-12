const Mailjet = require('node-mailjet');

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY
});

const sendEmail = async (options) => {
  try {
    const result = await mailjet
      .post("send", { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "skirankumar97849@gmail.com",
              Name: "DevCollab"
            },
            To: [
              {
                Email: options.email,
                Name: options.name
              }
            ],
            Subject: options.subject,
            TextPart: options.message,
            HTMLPart: options.html
          }
        ]
      });
    return result;
  } catch (err) {
    console.error('Mailjet Error:', err.statusCode);
    throw err;
  }
};

module.exports = sendEmail;
