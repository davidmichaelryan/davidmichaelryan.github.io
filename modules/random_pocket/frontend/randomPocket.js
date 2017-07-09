/* global $ */
/* eslint class-methods-use-this: 0 */

class RandomPocket {
  constructor() {
    this.articleBuffer = [];
    return this.authorize();
  }

  getBaseURL(fullUrl) {
    const divided = fullUrl.split('/');
    const baseUrl = divided[2];
    return baseUrl;
  }

  makeArticlePreview(data) {
    const title = data.resolved_title;
    const website = this.getBaseURL(data.resolved_url);
    const pocketUrl = `http://getpocket.com/a/read/${data.item_id}`;
    const realUrl = data.resolved_url;

    $('.subtitle').hide();
    $('.random .title').html(title);
    $('.random .website').html(website);
    $('.random .pocket_url').attr('href', pocketUrl);
    $('.random .og_url').attr('href', realUrl);
    $('#delete-button').attr('data-pocketid', data.item_id);
    $('.random .article-info').show();
  }

  createGetterEvent() {
    return $('#random-button').click((() => {
      if (this.articleBuffer.length < 3) {
        if (this.articleBuffer.length) {
          this.makeArticlePreview(this.articleBuffer.pop());
          $.post('/random_pocket/random', (articles) => {
            this.articleBuffer = this.articleBuffer.concat(articles);
          });
        } else {
          $.post('/random_pocket/random', (articles) => {
            this.makeArticlePreview(articles.pop());
            this.articleBuffer = this.articleBuffer.concat(articles);
          });
        }
      } else {
        this.makeArticlePreview(this.articleBuffer.pop());
      }
    }));
  }

  authorize() {
    return $.post('/random_pocket/authorize', () => {
      $('.auth').hide();
      $('.random').show();
      return this.createGetterEvent();
    });
  }
}

module.exports = RandomPocket;
