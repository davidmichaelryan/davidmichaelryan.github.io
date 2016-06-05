$ ->
    submitRecipes = (e) ->
        recipeTable = $("#new-recipes-table tbody tr")
        
        recipeData = []
        
        recipeTable.each ->
            recipeData.push
                title: $(this).find('td input[name="title"]').attr 'value'
                url: $(this).find('td input[name="url"]').attr 'value'
                image: $(this).find('td input[name="image"]').attr 'value'
                beentried: $(this).find('td input[name="beentried"]').attr 'value'

        $.post "/recipes", {recipeData}, (data) ->
            console.log "SUCCESS!"
        , "JSON"


    $("#submit-new-recipes").on 'click', submitRecipes
