require('dotenv').config();
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
const { url } = require('inspector');
const { response } = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});


app.post('/', (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let emailAddress = req.body.email;

    let data = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const audienceID = process.env.MAIL_C_AUDIENCE_ID;
    const mailchimpAPI = process.env.MAIL_CHIMP_API;
    const url = "https://us17.api.mailchimp.com/3.0/lists/" + audienceID;

    const options = {
        method: 'POST',
        auth: "password:" + mailchimpAPI
    }
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failure.html')

        }
        res.on("data", (data) => {
            console.log(JSON.parse(data))
        })


    })

    request.write(jsonData);
    request.end();
});

app.post('/failure', (req, res) => {
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port', process.env.PORT || 3000)
})