global.fetch = require("node-fetch");
const router = require('express').Router();
global.fetch = fetch;
const fs = require('fs').promises;

router.post("/login", async (req, res) => {
    const code = req.body.code;

    if (code) {
        console.log("Code provided...");
        console.log("Awaiting access token...")
    }

    const params = {
        client_id: process.env.unsplashKey,
        client_secret: process.env.unsplashSecret,
        redirect_uri: process.env.redirect_uri,
        code: code,
        grant_type: "authorization_code"
    }

    const response = await fetch("https://unsplash.com/oauth/token", {
        method: "POST",
        headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });
    const data = await response.json();

    let storage = {
        token: data.access_token
    };

    try {
        if (data) {
            console.log("Data available.")
            console.log("Writing file...", storage)
            fs.writeFile(`${__dirname}/tmp/data.json`, JSON.parse(storage), (err) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log('Update complete!')
                }
            })
            console.log("File update complete.")


        }
    } catch (error) {
        console.error(error)
    }

    try {
        const DATA_ACTUAL = require(`${__dirname}/tmp/data.json`)
        console.log(DATA_ACTUAL.token, "Generated Access Token...")
    } catch (error) {
        console.error(error)
    }

    if (!data.error) {
        res.status(200).send(data);
    }

    // process.exit(1);
});

router.post("/logout", (req, res) => {
    try {
        console.log("Removing token...")
        fs.unlink(`${__dirname}/tmp/data.json`)
        console.log("Token destroyed...")
    } catch (error) {
        console.error(error)
    }
    console.log("User has logged out...")
    // process.exit(1); 
});

module.exports = router;