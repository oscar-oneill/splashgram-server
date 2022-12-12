let user;

try {
    user = require(`./splashgram/data.json`)
} catch (error) {
    user = null;
}

let AccessToken = {
    token: user ? user.token : null
}

console.log(AccessToken, "Access Token retrieved from generated JSON file.")

exports.AccessToken = AccessToken