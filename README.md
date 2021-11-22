### CMI Express and Sendgrid

This app is used to send emails to users.

First you need to configure ENV files
```
EMAIL_FROM_CMI=<An email configured as a sender in Sendgrid>
SENDGRID_API_KEY=<An ApiKey from Sendgrid>
SENDGRID_TEMPLATE_ID=<Template for the Email that are we send it>
THREEKIT_PRIVATE_TOKEN=<Threekit private token>
THREEKIT_ENV=http://preview.threekit.com/
THREEKIT_ORG_ID=<Org Id from threekit>
```

To run in development mode you need to run the following command:
1. `create a file .env`
2. `npm run dev`

To run in production mode you need to run the following command:
1. `setup the ENV variables or change .env-sample to .env`
2. `Check the .env-sample for the variables to setup`
3. `npm start`
