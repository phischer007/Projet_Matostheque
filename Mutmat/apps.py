from django.apps import AppConfig


class MutmatConfig(AppConfig):
    # Setting the name of the application
    name = 'Mutmat'
    
    # Registering the signals when the app is ready
    def ready(self):
        import Mutmat.signals
