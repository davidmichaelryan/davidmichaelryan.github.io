const BATCH_SIZE = 5;

const getArticleBatch = (articles) => {
  const randomArticles = [];
  const idHash = {};

  let randomCounter = 0;

  while (randomArticles.length < BATCH_SIZE && randomCounter < articles.length) {
    const rand = Math.floor(Math.random() * articles.length);
    const article = articles[rand];

    if (!idHash[article.item_id]) {
      idHash[article.item_id] = true;
      randomArticles.push(article);
    }
    randomCounter += 1;
  }

  return randomArticles;
};

module.exports = { getArticleBatch };
