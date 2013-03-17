from domain.Recipes import Recipe
from domain.Recipes import RecipeItem
from FoodieHandler import FoodieHandler
from domain.Recipes import IngredientProvider
from Helper import Redirect
import json

class RecipesHandler(FoodieHandler):
    
    def get(self):
        recipe_query = Recipe.all()
        recipes = recipe_query.run()
            
        template_values = {
            'recipes': recipes,
            'location_provider': RecipeLocationProvider(),
        }
        
        self.render_template('recipes.html', template_values)
       
    @staticmethod 
    def location():
        return '/recipes'
    
    
class RecipeHandler(FoodieHandler):
    
    def get(self, recipe_key):
        recipe = Recipe.get(recipe_key)
        
        location_provider = RecipeLocationProvider()
        
        template_values = {
            'recipe': recipe,
            'location_provider': location_provider
        }
        
        self.render_template('recipe.html', template_values)
    
    @staticmethod
    def location():
        return '/recipe/(.*)'
    
    @staticmethod
    def location_for_recipe(key):
        return '/recipe/' + key
    
class RecipePhotoHandler(FoodieHandler):
    def get(self):
        recipe = Recipe.get(self.request.get('img_id'))
        self.set_img_response(recipe.photo)
        
    @staticmethod
    def location():
        return '/recipe_photo'
    
    @staticmethod
    def location_for_recipe(key):
        return '/recipe_photo?img_id=' + key
    
class RecipeIconHandler(FoodieHandler):
    def get(self):
        recipe = Recipe.get(self.request.get('img_id'))
        self.set_img_response(recipe.icon)
        
    @staticmethod
    def location():
        return '/recipe_icon'
    
    @staticmethod
    def location_for_recipe(key):
        return '/recipe_icon?img_id=' + key
   
class CreateRecipeHandler(FoodieHandler):
        
    def post(self):
        recipe = Recipe()
        
        recipe.title = self.request.get("title")
        recipe.author = self.request.get("author")
        recipe.cookbook = self.request.get("cookbook")
        recipe.set_photo(self.request.get("img"))
        
        ingredients = self.request.get_all("test")
        
        recipe.put()
        
        for ingredient in ingredients:
            RecipeItem(recipe=recipe, ingredient=ingredient).put()
        
        template_values = {
            "recipe": recipe,
            "location_provider": RecipeLocationProvider()
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
    
    def get_photo_location(self, recipe):
        str_id = str(recipe.key())
        return RecipePhotoHandler.location_for_recipe(str_id)
    
    def get_icon_location(self, recipe):
        str_id = str(recipe.key())
        return RecipeIconHandler.location_for_recipe(str_id)
    
    def get_save_location(self):
        return CreateRecipeHandler.location()
    