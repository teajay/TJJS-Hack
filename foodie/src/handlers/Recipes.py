from domain.Recipes import IngredientProvider
from domain.Recipes import Recipe
from domain.Recipes import RecipeItem
from FoodieHandler import FoodieHandler
from Helper import Redirect
from google.appengine.api import users
from google.appengine.ext.blobstore import BlobKey
from google.appengine.api import images
import json
from fractions import Fraction

class RecipesHandler(FoodieHandler):
    
    def get(self):
        recipe_query = Recipe.all().filter('user_id =', users.get_current_user().user_id())
        recipes = recipe_query.run()
            
        template_values = {
            'recipes': recipes
        }
            
        self.render_template('recipes.html', template_values)
           
    @staticmethod 
    def location():
        return '/recipes'
    
    
class RecipeHandler(FoodieHandler):
    
    def get(self, recipe_key):
        recipe = Recipe.get(recipe_key)
        
        template_values = {
            'recipe': recipe
        }
        
        self.render_template('recipe.html', template_values)
    
    @staticmethod
    def location():
        return '/recipe/(.*)'
    
    @staticmethod
    def location_for_recipe(key):
        return '/recipe/' + key
    
class CreateRecipeHandler(FoodieHandler):
        
    def post(self):
        recipe = Recipe()
        recipe.user_id = users.get_current_user().user_id()
        recipe.title = self.request.get("title")
        recipe.author = self.request.get("author")
        recipe.cookbook = self.request.get("cookbook")
        
        # Grab the file key if one was uploaded, calculate it's URL and store them both
        # The calculated URL doesn't change, and this way we don't have to compute it again 
        file_key = self.request.get("file_key", default_value=None)
        if file_key is not None:
            blob_key = BlobKey(file_key)
            recipe.photo_key = blob_key
            recipe.photo_url = images.get_serving_url(blob_key)
                
        recipe.put()
        
        ingredients = json.loads(self.request.get("ingredients"))
        for ingredient in ingredients:
            RecipeItem(
                recipe=recipe,
                ingredient=ingredient["ingredient"],
                quantity=float(Fraction(ingredient["quantity"])),
                unit=ingredient["unit"]).put()
        
        template_values = {
            "recipe": recipe
        }
        self.render_template("float_element.html", template_values)
        
    @staticmethod
    def location():
        return '/create_recipe' 

class DeleteRecipeHandler(FoodieHandler):
    
    def post(self, recipe_key):
        recipe = Recipe.get(recipe_key)
        recipe.delete()
        
        redirect = Redirect(RecipesHandler.location())
        self.set_json_response(json.dumps(redirect.__dict__))
    
    @staticmethod
    def location():
        return '/delete_recipe/(.*)'
    
    @staticmethod
    def location_for_recipe(recipe_key):
        return '/delete_recipe/' + recipe_key
          
class IngredientsHandler(FoodieHandler):
    
    ingredientProvider = IngredientProvider()
    
    def get(self):
        partial_ingredient = self.request.get("term")
        matches = self.ingredientProvider.get_ingredient_starting_with(partial_ingredient)
        response = json.dumps(matches)
        self.set_json_response(response)
        
    @staticmethod
    def location():
        return '/get_ingredients'
    
class RecipeLocationProvider:
    
    def get_location(self, recipe):
        str_id = str(recipe.key())
        return RecipeHandler.location_for_recipe(str_id)
    
    def get_delete_location(self, recipe):
        str_id = str(recipe.key())
        return DeleteRecipeHandler.location_for_recipe(str_id)
    
    def get_save_location(self):
        return CreateRecipeHandler.location()
    
    def get_home_location(self):
        return RecipesHandler.location()
    
    
