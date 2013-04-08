from google.appengine.ext import endpoints
from protorpc import remote
from service.FoodieMessages import GetRecipesRequest
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
        recipe_query = Recipe.all().filter('user_id =', request.user_id)
        recipes_model = recipe_query.run()
        recipes_response = []
        for recipe_model in recipes_model:
            recipe_message = RecipeMessage(title=recipe_model.title,
                                           author=recipe_model.author,
                                           cookbook=recipe_model.cookbook)
            'TODO: Figure out the URL of images to include in response. Client can render them if they want that way'
            'TODO: Implement logic to see if they asked for ingredients and send them back'
            recipes_response.append(recipe_message)
            
        return GetRecipesResponse(recipes=recipes_response)