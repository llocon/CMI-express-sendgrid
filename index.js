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


app.post("/api/healthcheck", (_, res) => {
  res.status(200).send({
    message: "API is online"
  })
})

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
    "template_id": process.env.SENDGRID_TEMPLATE_INTERNAL_ID || "d-5a755a5959e94f259769521743c880c6"
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

app.post("/api/snapshot", cors(), async (req, res) => {
  try {
    const fetch = require('node-fetch');
    const { assetId, layerConfiguration } = req.body;
    var bear = process.env.THREEKIT_PRIVATE_TOKEN;
    var org_id = process.env.THREEKIT_ORG_ID;

    const obj_body = {
      orgId: org_id,
      configuration: layerConfiguration,
      stageId: '',
      stageConfiguration: {},
      sync: true,
      settings: { output: { resolution: { width: 512, height: 512 } } }
    }
    var obj = {};
    const response = await fetch(`https://preview.threekit.com/api/asset-jobs/${assetId}/render/webgl/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": "Bearer " + bear
      },
      body: JSON.stringify(obj_body) // body data type must match "Content-Type" header
    }).then(response => response.json()).then(data => obj = data);

    // const obj = await response.json()
     const file = obj.job.runs[0].results.files[0].id;
    res.send({ file_id: "https://preview.threekit.com/api/files/" + file + "/content" });
  } catch (e) {
    res.send({ errorMessage: e })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://<url>:${port}`)
})