if (process.env.NODE_ENV === "development") {
  require('dotenv').config();
}

const express = require('express');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const app = express();
const port = process.env.PORT || 3000

app.use(express.json({ limit: '500kb' }))

app.post("/api/email", async (req, res) => {
  const { name, lastname, email, config } = req.body;

  const msg = {
    from: {
      name: "Luis from Cognits",
      email: process.env.EMAIL_FROM_CMI
    },
    personalizations: [
      {
        to: [email],
        dynamic_template_data: {
          name: `${name} ${lastname}`,
          ...config,
        }
      }
    ],
    subject: 'CMI - Request Recap',
    "template_id": process.env.SENDGRID_TEMPLATE_ID
  }
  try {
    let response = await sgMail.send(msg);
    res.send({ Status:  response[0].statusCode })
  } catch (error) {
    res.send({ message: error })
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://<url>:${port}`)
})