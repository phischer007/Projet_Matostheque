from django.apps import AppConfig


class MatosthequeConfig(AppConfig):
    # Setting the name of the application
    name = 'Matostheque'
    
    # Registering the signals when the app is ready
    def ready(self):
        import Matostheque.signals
