from django.db import models

class Laboratory(models.Model):

    # A unique identifier for the laboratory.
    laboratory_id = models.AutoField(primary_key=True,serialize=False, verbose_name='ID')

    # A name for the laboratory
    laboratory_name = models.CharField(max_length=100)

    # The date and time when the laboratory was created.
    created_at = models.DateTimeField(auto_now_add=True)

    # The date and time when the laboratory was last updated.
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.laboratory_name