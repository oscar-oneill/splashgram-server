global.fetch = require("node-fetch");
const router = require('express').Router();
global.fetch = fetch;
const fs = require('fs').promises;
const { LocalStorage } = require("node-localstorage");
var localStorage = new LocalStorage('./scratch'); 

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

    localStorage.setItem('access_token', data.access_token);

    if (!data.error) {
        res.status(200).send(data);
    }

    process.exit(1);
});

router.post("/logout", (req, res) => {
    console.log("Current user has issued a request to logout...")
    try {
        console.log("Removing token...")
        localStorage.removeItem('access_token')
        console.log("Token destroyed...")
    } catch (error) {
        console.error(error)
    }
    console.log("User has logged out...")
    process.exit(1); 
});

module.exports = router;