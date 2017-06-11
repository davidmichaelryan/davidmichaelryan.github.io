'use strict';

class RandomPocket {
  constructor() {
    return this.authorize();
  }

  authorize() {
    return $.post('/authorize', (data) => {
      $('.auth').hide();
      $('.random').show();
      return this.createGetterEvent();
    });
  }

  getBaseURL(fullUrl) {
    const divided = fullUrl.split('/');
    const baseUrl = divided[2];
    return baseUrl;
  }

  createGetterEvent() {
    return $("#random-button").click(() => {
      $.post("/random", (data) => {
        const title = data.resolved_title;
        const website = this.getBaseURL(data.resolved_url);
        const pocketUrl = `http://getpocket.com/a/read/${data.item_id}`;
        const realUrl = data.resolved_url;

        $(".random .title").html(title);
        $(".random .website").html(website);
        $(".random .pocket_url").attr('href', pocketUrl);
        $(".random .og_url").attr('href', realUrl);
        $("#delete-button").attr('data-pocketid', data.item_id);
        $(".random .article-info").show();
      })
    });
  }
}

module.exports = RandomPocket;
