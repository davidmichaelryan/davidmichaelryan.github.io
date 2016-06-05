{each} = require 'async'
{assign} = require 'lodash'
Recipe = require './models/recipes'

base_partials =
  head: "head"
  header: "header"
  footer: "footer"

module.exports =
    main:  (req, res) ->
        res.locals =
          includeJs:
            jquery: true
            recipesJs: true

        console.log "HERE!"

        # newRecipes = """"http://cooking.nytimes.com/recipes/2653-basic-pesto?smid=tw-nytimes">Basic Pesto Recipe - NYT CookingBasic Pesto Recipe - NYT Cooking.webloc</A><DT><A HREF="http://breadtopia.com/cooks-illustrated-almost-no-knead/">Breadtopia | Cook’s Illustrated Almost No Knead</A><DT><A HREF="http://cooking.nytimes.com/recipes/1017444-bulgogi-korean-grilled-beef?smid=tw-nytimes">Bulgogi (Korean Grilled Beef) Recipe - NYT Cooking</A><DT><A HREF="https://www.cooksillustrated.com/recipes/6218-classic-spaghetti-and-meatballs-for-a-crowd">Classic Spaghetti and Meatballs for a Crowd Recipe - Cook's Illustrated</A><DT><A HREF="https://bluebottlecoffee.com/preparation-guides/cold-brew">Cold Brew Brewing Guide | Blue Bottle Coffee</A><DT><A HREF="http://www.nytimes.com/2015/04/22/dining/conquering-the-fear-of-cooking-fish.html?smid=tw-nytimes&_r=0">Conquering the Fear of Cooking Fish - NYTimes.com</A><DT><A HREF="http://cooking.nytimes.com/recipes/1015825-creamy-macaroni-and-cheese?smid=tw-nytimes">Creamy Macaroni and Cheese Recipe - NYT Cooking</A><DT><A HREF="http://www.nytimes.com/2015/04/29/dining/enchiladas-light-yet-satisfying.html?src=twr&smid=tw-nytimes&_r=0">Enchiladas, Light Yet Satisfying - The New York Times</A><DT><A HREF="http://www.halfbakedharvest.com/toasted-walnut-pesto-caramelized-nectarine-pizza-wspicy-balsamic-drizzle/">Half Baked Harvest - Made with Love</A><DT><A HREF="http://www.nytimes.com/2015/04/08/dining/homemade-pizza-easier-and-faster.html?smid=tw-nytimes&_r=0">Homemade Pizza, Easier and Faster - NYTimes.com</A><DT><A HREF="http://www.amazon.com/Mina-Stone-Cooking-Artists/dp/098472107X">Mina Stone: Cooking for Artists</A><DT><A HREF="http://www.ottolenghi.co.uk/">Ottolenghi - Home</A><DT><A HREF="http://cooking.nytimes.com/68861692-nyt-cooking/907513-potatoes-beyond-baked?smid=tw-nytfood">Potatoes: Beyond Baked - NYT Cooking</A><DT><A HREF="http://www.foodnetwork.com/recipes/wicked-chicken-riggies-recipe.html">Wicked Chicken Riggies Recipe : Food Network</A><DT><A HREF="http://cooking.nytimes.com/53532060/intro">Your Recipe Box | Find Some Recipes - NYT Cooking</A><DT><A HREF="http://food52.com/blog/7317-how-to-make-cold-brewed-coffee">How to Make Cold-Brewed Coffee</A><DT><A HREF="http://cooking.nytimes.com/recipes/8663-spaghetti-with-fresh-tomato-and-basil-sauce?smid=tw-nytimes">Spaghetti With Fresh Tomato and Basil Sauce Recipe - NYT Cooking</A><DT><A HREF="http://cooking.nytimes.com/recipes/1014784-cold-rice-noodles-with-grilled-chicken-and-peanut-sauce?smid=tw-nytimes">Cold Rice Noodles With Grilled Chicken and Peanut Sauce Recipe - NYT Cooking</A><DT><A HREF="http://www.aglaiakremezi.com/">Aglaia's Table οn Kea Cyclades - Editorial, Recipes and more</A><DT><A HREF="http://www.thekitchn.com/recipe-paximadi-bread-salad-with-tomatoes-feta-and-capers-recipes-from-the-kitchn-189938">True Greek Recipe: Paximadi Bread Salad with Tomatoes, Feta and Capers — Recipes from The Kitchn | The Kitchn</A><DT><A HREF="http://www.theawl.com/2015/08/greek-the-salad?src=longreads">Greek the Salad - The Awl</A><DT><A HREF="http://cooking.nytimes.com/recipes/11376-no-knead-bread">No-Knead Bread Recipe - NYT Cooking</A><DT><A HREF="http://americastestkitchen.buysub.com/cook-s-illustrated-special-magazine-issues/cook-s-illustrated-all-time-best-bread-recipes.html">Cook's Illustrated All-Time Best Bread Recipes</A><DT><A HREF="http://www.chow.com/recipes/30487-basic-cold-brewed-coffee">Easy Cold-Brewed Coffee Recipe - CHOW.com</A><DT><A HREF="http://www.foodnetwork.com/recipes/alton-brown/kinda-sorta-sours-recipe.html">Kinda Sorta Sours Recipe : Alton Brown : Food Network</A><DT><A HREF="http://cooking.nytimes.com/recipes/1015232-green-goddess-roasted-chicken?smid=tw-nytimes&smtyp=cur">Green Goddess Roasted Chicken Recipe - NYT Cooking</A><DT><A HREF="http://cooking.nytimes.com/recipes/1016067-easy-sheet-pan-chicken?smid=tw-nytimes&smtyp=cur">Easy Sheet-Pan Chicken Recipe - NYT Cooking</A><DT><A HREF="http://cooking.nytimes.com/recipes/1017651-pasta-with-fresh-tomato-sauce-and-ricotta?smid=tw-nytimes&smtyp=cur">Pasta With Fresh Tomato Sauce and Ricotta Recipe - NYT Cooking</A><DT><A HREF="http://www.foodnetwork.com/recipes/alton-brown/pad-thai-recipe.html">Pad Thai Recipe : Alton Brown : Food Network</A><DT><A HREF="http://cooking.nytimes.com/recipes/1015181-marcella-hazans-bolognese-sauce?smid=tw-nytimes&smtyp=cur">Marcella Hazan's Bolognese Sauce Recipe - NYT Cooking</A><DT><A HREF="http://cooking.nytimes.com/68861692/369703-things-you-should-make-not-buy?smid=tw-nytimes&smtyp=cur">Things You Should Make, Not Buy - NYT Cooking</A><DT><A HREF="http://cooking.nytimes.com/recipes/1016153-lemon-and-garlic-chicken-with-mushrooms?smid=tw-nytimes&smtyp=cur">Lemon and Garlic Chicken With Mushrooms Recipe - NYT Cooking</A><DT><A HREF="http://www.seriouseats.com/2014/09/the-food-lab-use-the-oven-to-make-the-best-darned-italian-american-red-sauce-ever-recipe.html">The Food Lab: Use the Oven to Make the Best Darned Italian American Red Sauce You've Ever Tasted | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2011/06/the-food-lab-the-science-of-no-knead-dough.html">The Food Lab: The Science of No-Knead Dough | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2015/09/how-to-season-and-maintain-a-wood-cutting-board.html">How to Season and Maintain a Wooden Cutting Board | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2016/02/how-to-make-pasta-spaghetti-aglio-olio.html">Aglio e Olio: The One Pasta Sauce You Absolutely Must Know | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/recipes/2016/02/spaghetti-cacio-e-pepe-recipe.html">Cacio e Pepe (Spaghetti With Black Pepper and Pecorino Romano) | Serious Eats</A><DT><A HREF="http://cooking.nytimes.com/recipes/1015181-marcella-hazans-bolognese-sauce">Marcella Hazan's Bolognese Sauce Recipe - NYT Cooking</A><DT><A HREF="http://cooking.nytimes.com/recipes/1017908-green-chilaquiles-with-eggs">Green Chilaquiles With Eggs Recipe - NYT Cooking</A><DT><A HREF="http://cooking.nytimes.com/recipes/1016833-spaghetti-and-drop-meatballs-with-tomato-sauce?smid=tw-nytfood&smtyp=cur">Spaghetti and Drop Meatballs With Tomato Sauce Recipe - NYT Cooking</A><DT><A HREF="http://cooking.nytimes.com/recipes/1015178-marcella-hazans-tomato-sauce?smid=tw-nytimes&smtyp=cur">Marcella Hazan’s Tomato Sauce Recipe - NYT Cooking</A><DT><A HREF="http://www.bonappetit.com/recipe/rice-bowl-fried-egg-avocado">Rice Bowl with Fried Egg and Avocado Recipe - Bon Appétit</A><DT><A HREF="http://www.bonappetit.com/recipe/spicy-kimchi-tofu-stew">Spicy Kimchi Tofu Stew Recipe - Bon Appétit</A><DT><A HREF="http://www.bonappetit.com/recipe/brussels-sprouts-and-tofu-stir-fry">Brussels Sprouts and Tofu Stir-Fry Recipe - Bon Appétit</A><DT><A HREF="http://www.foodnetwork.com/recipes/food-network-kitchens/quinoa-with-roasted-butternut-squash.html">Quinoa with Roasted Butternut Squash Recipe : Food Network Kitchen : Food Network</A><DT><A HREF="http://www.seriouseats.com/recipes/2013/02/hearty-vegetable-stock-vegan-recipe.html">Hearty Vegetable Stock (Vegan) | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/recipes/2015/11/quick-and-easy-vegetable-stock-recipe.html">Quick and Easy Vegetable Stock | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2016/03/easy-vegan-crispy-tofu-spring-rolls-tamarind-peanut-dipping-sauce.html">Make These Easy Crispy Tofu Spring Rolls With Peanut-Tamarind Sauce | Serious Eats</A><DT><A HREF="http://cooking.nytimes.com/recipes/1014721-shakshuka-with-feta">Shakshuka With Feta Recipe - NYT Cooking</A><DT><A HREF="http://www.amazon.com/Darksiders-2-Deathinitive-Edition-PlayStation-4/dp/B00TKLFOLK">Amazon.com: Darksiders 2: Deathinitive Edition - PlayStation 4: Nordic Games Na Inc: Video Games</A><DT><A HREF="http://www.seriouseats.com/2015/03/how-to-make-sichuan-wontons-in-chili-oil-dumpling.html">How to Make Sichuan-Style Wontons in Chili Oil | Serious Eats</A><DT><A HREF="http://cooking.nytimes.com/recipes/1016240-spanish-asparagus-revuelto">Spanish Asparagus Revuelto Recipe - NYT Cooking</A><DT><A HREF="http://www.seriouseats.com/recipes/2016/04/tamago-kake-gohan-egg-rice-tkg-recipe-breakfast.html">Tamago Kake Gohan (Japanese-Style Rice With Egg) | Serious Eats</A><DT><A HREF="http://cooking.nytimes.com/recipes/3869-sauteed-spinach">Sautéed Spinach Recipe - NYT Cooking</A><DT><A HREF="http://www.seriouseats.com/2013/07/how-to-make-mexican-street-corn-elotes.html">How To Make Mexican Street Corn (Elotes) | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2016/04/how-to-make-fresh-nixtamalized-corn-tortillas-from-scratch.html">The Easy Way to Make Fresh Corn Tortillas at Home | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2015/08/whole-grilled-fish-tacos.html">Grill Your Fish Whole for the Juiciest Fish Tacos | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2015/04/the-best-way-to-store-fresh-herbs-parsley-cilantro-dill-basil.html">The Best Way to Store Fresh Herbs | Serious Eats</A><DT><A HREF="https://www.buzzfeed.com/melissaharrison/mozzarella-stick-onion-rings?utm_term=.kmxO2J6dAG#.yldpbqPQJk">These Mozzarella Stick Onion Rings Should Run For President</A><DT><A HREF="http://www.seriouseats.com/2016/05/extra-crispy-cheesy-browned-cheese-taco-yucatan-mexico.html">The Yucatecan Secret for Adding Crispy, Cheesy Flavor to Any Taco | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/recipes/2011/12/serious-eats-halal-cart-style-chicken-and-rice-white-sauce-recipe.html">Serious Eats' Halal Cart-Style Chicken and Rice with White Sauce  | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2016/05/the-food-lab-spicy-spring-new-york-best-sicilian-pizza-at-home.html">The Food Lab: How to Make New York's Finest Sicilian Pizza at Home | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2013/09/how-to-make-chilaquiles-verdes-recipe.html">How To Make Chilaquiles Verdes | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2016/05/morels-with-fried-eggs-bacon-ramp-easy-spring-breakfast.html">Quick! Make These Fried Eggs With Morels, Ramps, and Bacon | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2015/05/how-to-make-mexican-tamales-corn-masa.html?utm_source=tw&utm_campaign=may16">How to Make Mexican Tamales | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2015/02/the-food-lab-how-to-grill-tofu-vegan-experience.html">The Food Lab: How to Grill or Broil Tofu That's Really Worth Eating | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/recipes/2014/07/thai-style-grilled-chicken-recipe.html">Thai-Style Grilled Chicken (Gai Yang) Recipe | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2012/07/barbecue-sauce-recipes-regional-styles-kansas-city-memphis-carolinas.html">Make Your Own Barbecue Sauce: 12 Recipes | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2014/02/vegan-experience-crispy-tofu-worth-eating-recipe.html">How to Cook Crispy Tofu Worth Eating | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2013/02/vegan-udon-mushroom-soy-cabbage-vegan-experience.html">How to Make Delicious Vegan Udon Broth | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2012/01/vegan-noodle-stir-fry.html">Vegan: Noodle Stir Fry? Reverse The Ratios | Serious Eats</A><DT><A HREF="http://www.nytimes.com/2007/10/17/dining/17mini.html?_r=0">Serving Pasta? Forget What You Learned - The New York Times</A><DT><A HREF="http://www.seriouseats.com/2013/02/vegan-salads-to-make-ahead-recipes.html">The Importance of Hearty Make-Ahead Salads | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2015/02/how-to-make-sichuan-hot-and-sour-eggplant-vegan-experience-food-lab-fish-fragrant-eggplant.html">Sichuan-Style Hot and Sour Eggplant Is a Great Dish That Just Happens to Be Vegan | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2015/02/how-to-make-the-ultimate-vegan-ramen-rich-and-creamy-vegan-experience.html">How to Make the Ultimate Rich and Creamy Vegan Ramen | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2016/03/phat-phrik-khing-with-tofu-long-beans-dry-fry-thai-curry-mortar-and-pestle-vegan-experience.html">Phat Phrik Khing: Smash Your Way to a Spectacular Dry-Style Thai Curry | Serious Eats</A><DT><A HREF="http://www.seriouseats.com/2010/06/wok-skills-101-stir-frying-basics.html">Wok Skills 101: Stir-Frying Basics | Serious Eats"""

        # newRecipeHash = newRecipes.split "</A><DT><A HREF="

        # newRecipeList = []
        # for recipeString in newRecipeHash
        #     recipeString = recipeString[1..-1]
        #     recipeData = recipeString.split '">'
        #     newRecipeList.push
        #         title: recipeData[1]
        #         url: recipeData[0]
        # res.locals.newRecipeList = newRecipeList
        # res.locals.inputtingRecipes = true

        Recipe.find (err, recipes) ->
            if err
                console.log "ERROR FETCHING RECIPES"
                console.log err
            else
                res.locals.recipeList = recipes
                recipes_partials = assign {}, base_partials, {recipes: "recipes"}

                res.render "index",
                  partials: recipes_partials

    submit: (req, res) ->
        {recipeData} = req.body

        newRecipeList = []

        for recipe in recipeData
            newRecipe = new Recipe()
            assign newRecipe, 
                beenTried: recipe.beentried?,
                image: recipe.image,
                title: recipe.title,
                url: recipe.url

            newRecipeList.push newRecipe
        
        each newRecipeList, (recipe, callback) ->
            recipe.save (err) ->
                if err
                    callback(err, {})
                else
                    callback(null, {})    
            , (err) ->
                if err
                    res.send err       
                else
                    res.json
                        message: "recipes saved!"

    lint: (req, res) ->
        Recipe.update {}, { $set: { beenTried: false }}, {multi: true}, ->
            res.send "BOOM DONE"
