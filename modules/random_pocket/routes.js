const request = require('request');
const { getArticleBatch } = require('./helpers.js');

require('dotenv').load();

const consumerKey = process.env.CONSUMER_KEY;

module.exports = (app) => {
  app.get('/random_pocket', (req, res) => {
    if (req.cookies.token !== undefined) {
      res.render('modules/random_pocket/auth');
    } else {
      res.render('modules/random_pocket/login');
    }
  });

  app.post('/random_pocket/authorize', (req, res) => {
    if (req.cookies.access_token) {
      return res.send('success');
    }

    const tokenCookie = req.cookies.token;
    return request.post('https://getpocket.com/v3/oauth/authorize', {
      form: {
        consumer_key: consumerKey,
        code: tokenCookie,
      },
    },
    (error, response, body) => {
      res.clearCookie('token');
      const [accessTokenCookie, usernameCookie] = body.split('&');
      const accessToken = accessTokenCookie.split('=')[1];
      const username = usernameCookie.split('=')[1];
      res.cookie('access_token', accessToken, { maxAge: 900000 });
      res.cookie('username', username, { maxAge: 900000 });
      return res.send('success');
    });
  });

  app.get('/random_pocket/request', (req, res) =>
    request.post('https://getpocket.com/v3/oauth/request', {
      form: {
        consumer_key: consumerKey,
        redirect_uri: '/random_pocket',
      },
    },
      (error, response, body) => {
        if (error) {
          return res.send(`error: ${error}`);
        }
        const requestToken = body.split('=')[1];
        const url = `https://getpocket.com/auth/authorize?request_token=${
                       requestToken
                       }&redirect_uri=http://${
                       req.headers.host
                       }/random_pocket`;
        res.cookie('token', requestToken, { maxAge: 900000 });
        return res.redirect(url);
      }
    )
  );

  app.post('/random_pocket/random', (req, res) => {
    const accessToken = req.cookies.access_token;
    return request.post('https://getpocket.com/v3/get',
      {
        form: {
          consumer_key: consumerKey,
          access_token: accessToken,
        },
      },
      (error, response, body) => {
        let { list: articles } = JSON.parse(body);
        articles = Object.keys(articles).map(k => articles[k]);

        const randomArticles = getArticleBatch(articles);
        return res.send(randomArticles);
      });
  });

  // app.post "/delete", (req, res) ->
  //   accessToken = req.cookies.access_token
  //   request.post "https://getpocket.com/v3/send",
  //     form:
  //       action: "delete"
  //       item_id: req.body.pocketid
  //   , (error, response, body) ->
  //     data = JSON.parse body

  //     res.send randomArticle
  //     return
  //   return
};
