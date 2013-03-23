
location_provider = None

def register_location_provider(provider):
    global location_provider
    location_provider = provider
    
def get_location_provider():
    global location_provider
    return location_provider

