import webapp2
import jinja2

from google.appengine.api import users
import Locations as locations

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))

class FoodieHandler(webapp2.RequestHandler):
    
    def render_template(self, template_name, template_values):
        user = users.get_current_user()
        url = users.create_logout_url(self.request.uri)
        user_name = user.nickname()
        default_template_values = {
            'user_name': user_name,
            'url': url,
            'location_provider': locations.get_location_provider(),
        }
        
        all_values = dict(default_template_values.items() + template_values.items()) 
        
        template = jinja_environment.get_template(template_name)
        self.response.out.write(template.render(all_values))
            
    def set_json_response(self, json_response):
        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json_response)
        
        
    def set_img_response(self, image):
        if image:
            self.response.headers['Content-Type'] = 'image/png'
            self.response.out.write(image)
        else:
            self.error(404)
    