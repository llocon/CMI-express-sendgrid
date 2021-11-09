if (process.env.NODE_ENV === "development") {
  require('dotenv').config();
}

const express = require('express');
const sgMail = require('@sendgrid/mail')
const cors = require('cors');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const app = express();
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json({ limit: '500kb' }))

app.post("/api/email", cors(), async (req, res) => {
  const { name, lastname, email, config } = req.body;

  const msg = [{ // Internal Email to CMI
    from: {
      name: "Corrugated Metals, Inc",
      email: process.env.EMAIL_FROM_CMI
    },
    personalizations: [
      {
        to: [email],
        dynamic_template_data: {
          name: `${name} ${lastname}`,
          ...req.body,
          ...config,
        }
      }
    ],
    subject: 'CMI - Request Recap',
    "template_id": "d-5a755a5959e94f259769521743c880c6"
  },
  { // Email to Client 
    from: {
      name: "Corrugated Metals, Inc",
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
  },
]
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