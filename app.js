    //jshint esversion:6
    const express = require('express');
    const bodyParser = require('body-parser');
    const request = require('request');
    const https = require('https');

    //setup server
    const app = express();
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended:true}));

    app.get("/", function(req, res) {
        res.sendFile(__dirname + "/signup.html");
    });

    app.post("/" , function(req,res){
        const firstName = req.body.firstName;
        const lastName  = req.body.lastName;
        const email     = req.body.email;
        console.log(firstName , lastName , email);

        const data = {
            members:[
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields:{
                        FNAME: firstName,
                        LNAME: lastName
                    }
                }
            ]
        };

        const jsonData = JSON.stringify(data);
        const url = "https://us19.api.mailchimp.com/3.0/lists/30b2429568";
        const options = {
            method: "POST",
            auth: "akhilchoudhary:234ace6803c0568254799caa2fbac384-us19"
        };
        const request = https.request(url,options,function(response){

            if(response.statusCode === 200 ) {
                res.sendFile( __dirname +"/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }

            response.on("data" , function(data){
                console.log(JSON.parse(data));
            });
        });

        request.write(jsonData);
        request.end();

        //res.send("Submitted");
    });

    app.post("/failure" , function(req,res){
        res.redirect("/");
    });


    //start listning
    app.listen(process.env.PORT || 3000, function() {
        console.log("server is listning on port 3000");
    });

    //--data '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}' \


    //API key
    //234ace6803c0568254799caa2fbac384-us19

    //list ID
    //30b2429568
