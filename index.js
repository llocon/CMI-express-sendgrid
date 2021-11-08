if (process.env.NODE_ENV === "development") {
  require('dotenv').config();
}

const express = require('express');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const app = express();
const port = process.env.PORT || 3000

app.use(express.json({ limit: '500kb' }))

app.post("/api/email", (req, res) => {
  const { name, lastname, email, date, config } = req.body;

  const msg = {
    from: process.env.EMAIL_FROM_CMI, // Change to your verified sender
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

  sgMail
  .send(msg)
  .then((response) => {
    res.send({ Status:  response[0].statusCode })
  })
  .catch((error) => {
    res.send({ message: error })
  })

  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


/**
 * {
  city: 'Guatemala',
  company: 'cognits, S.A.',
  config: {
    color: 'Silver',
    footing: '5000 - 10000',
    hexColor: '#e9e9e9',
    imageURI: 'ww',
    materialType: 'Galvanized Steel',
    painType: 'Metallic Colors',
    placement: 'Walls',
    thickness: '12G',
    title: 'V-Beam'
  },
  date: '2021-11-18',
  email: 'luis@example.com',
  lastname: 'Locon',
  name: 'Luis',
  state: 'Guatemala',
  street: 'Guatemala'
}
 */