(function() {
  $(function() {
    var submitRecipes;
    submitRecipes = function(e) {
      var recipeData, recipeTable;
      recipeTable = $("#new-recipes-table tbody tr");
      recipeData = [];
      recipeTable.each(function() {
        return recipeData.push({
          title: $(this).find('td input[name="title"]').attr('value'),
          url: $(this).find('td input[name="url"]').attr('value'),
          image: $(this).find('td input[name="image"]').attr('value'),
          beentried: $(this).find('td input[name="beentried"]').attr('value')
        });
      });
      return $.post("/recipes", {
        recipeData: recipeData
      }, function(data) {
        return console.log("SUCCESS!");
      }, "JSON");
    };
    return $("#submit-new-recipes").on('click', submitRecipes);
  });

}).call(this);
