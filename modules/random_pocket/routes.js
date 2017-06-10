const request = require('request');
require('dotenv').load();
const consumerKey = process.env.CONSUMER_KEY;

module.exports = function (app) {
    app.post('/random_pocket/request', (req, res) => {
        request.post('https://getpocket.com/v3/oauth/request', 
            {
                form: {
                    consumer_key: consumerKey,
                    redirect_uri: '/random'
                }
            },
            (error, response, body) => {
                if (error) {
                    console.log('there was an error');
                }
                else {
                    const request_token = body.split("=")[1];
                    const url = `https://getpocket.com/auth/authorize?request_token=${request_token}&redirect_uri=http://${req.headers.host}/random`;
                    res.cookie('token', request_token, {maxAge: 900000});
                    res.redirect(url);
                }
            }
        )
    });

    app.get('/random_pocket', (req, res) => {
        res.render('modules/random_pocket');
    });    
};
