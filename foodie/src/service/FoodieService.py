from google.appengine.ext import endpoints
from protorpc import remote
from service.FoodieMessages import GetRecipesRequest, IngredientMessage
from service.FoodieMessages import GetRecipesResponse
from service.FoodieMessages import RecipeMessage
from domain.Recipes import Recipe

@endpoints.api(name='foodie', version='v1',
               description='Foodie service')
class FoodieService(remote.Service):
    
    @endpoints.method(GetRecipesRequest, GetRecipesResponse, 
                      name='getrecipe', path='recipe', 
                      http_method='GET')
    def get_recipe(self,request):
        'TODO: Figure out the URL of images to include in response. Client can render them if they want that way'
        recipe_query = Recipe.all().filter('user_id =', request.user_id)
        recipes_model = recipe_query.run()
        recipes_response = []
        for recipe_model in recipes_model:
            recipe_message = RecipeMessage(title=recipe_model.title,
                                           author=recipe_model.author,
                                           cookbook=recipe_model.cookbook)
            if request.include_ingredients and request.include_ingredients.lower() == 'true':
                ingredients_message = []
                ingredients_model = recipe_model.items.run()
                for ingredient_model in ingredients_model:
                    ingredients_message.append(IngredientMessage(ingredient=ingredient_model.ingredient,
                                                                quantity=ingredient_model.quantity,
                                                                unit=ingredient_model.unit))
                recipe_message.ingredients = ingredients_message
            recipes_response.append(recipe_message)
    
        return GetRecipesResponse(recipes=recipes_response)