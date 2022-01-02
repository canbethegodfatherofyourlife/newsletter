const express = require('express');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
const request = require('request');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req, res) => {

    var firstName = req.body.fname
    var lastName = req.body.lname
    var email = req.body.email

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = "https://us20.api.mailchimp.com/3.0/lists/84cb881f0b"

    const options = {
        method: 'POST',
        auth:"arka:6e915de084d450cc6cd8274fd6cd99a0-us20"
    }

    const request  = https.request(url,options,function(response){


        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }

        response.on('data',function(data){
            console.log(JSON.parse(data))
        })

    })

    request.write(jsonData)
    request.end()
})

app.post('/failure', function(req, res){
    res.redirect('/')
})
app.listen(process.env.PORT || 3000,console.log("Server Up and Running..."))

// Api  Key - 6e915de084d450cc6cd8274fd6cd99a0-us20
// List Id  - 84cb881f0b