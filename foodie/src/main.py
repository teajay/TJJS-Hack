import webapp2
from handlers.Recipes import *
from handlers.Files import FileUploadHandler
import handlers.Locations as locations

locations.register_location_provider(RecipeLocationProvider())

app = webapp2.WSGIApplication([(CreateRecipeHandler.location(), CreateRecipeHandler),
                               (RecipesHandler.location(), RecipesHandler),
                               (IngredientsHandler.location(), IngredientsHandler),
                               (RecipeHandler.location(), RecipeHandler),
                               (DeleteRecipeHandler.location(), DeleteRecipeHandler),
                               (RecipePhotoHandler.location(), RecipePhotoHandler),
                               (RecipeIconHandler.location(), RecipeIconHandler),
                               (FileUploadHandler.location(), FileUploadHandler)],
                              debug=True)