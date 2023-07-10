from .local import *
from urllib.parse import urlparse

APPENGINE_URL = env('APPENGINE_URL', default=None)
if APPENGINE_URL:
    if not urlparse(APPENGINE_URL).scheme:
        APPENGINE_URL = f'https://{APPENGINE_URL}'

    ALLOWED_HOSTS = [urlparse(APPENGINE_URL).netloc]
    CSRF_TRUSTED_ORIGINS = [APPENGINE_URL]
    SECURE_SSL_REDIRECT = True
else:
    ALLOWED_HOSTS = ['*']

DATABASES = {'default': env.db()}
