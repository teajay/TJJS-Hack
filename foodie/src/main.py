import webapp2
from google.appengine.ext import endpoints
from handlers.Recipes import *
from handlers.Files import *
from service.FoodieService import FoodieService
import handlers.Locations as locations

locations.register_location_provider(RecipeLocationProvider())

app = webapp2.WSGIApplication([(CreateRecipeHandler.location(), CreateRecipeHandler),
                               (RecipesHandler.location(), RecipesHandler),
                               (IngredientsHandler.location(), IngredientsHandler),
                               (RecipeHandler.location(), RecipeHandler),
                               (DeleteRecipeHandler.location(), DeleteRecipeHandler),
                               (RecipePhotoHandler.location(), RecipePhotoHandler),
                               (RecipeIconHandler.location(), RecipeIconHandler),
                               (FileUploadHandler.location(), FileUploadHandler),
                               (RemoveFileUploadHandler.location(), RemoveFileUploadHandler)],
                              debug=True)

service = endpoints.api_server([FoodieService],
                               restricted=False)