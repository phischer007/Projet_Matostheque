from django.db import models

from Matostheque.models.laboratory_model import Laboratory


class TrustCircle(models.Model):

    # A unique identifier for the trust circle.
    trust_circle_id = models.AutoField(primary_key=True)

    # The name of the trust circle
    trust_circle_name = models.CharField(max_length=255)

    # The name of the laboratory in the trust circle
    laboratory = models.ManyToManyField(Laboratory, related_name='trust_circles')

    # The date and time when the trust circle was created.
    created_at = models.DateTimeField(auto_now_add=True)

    # The date and time when the trust circle was last updated.
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.trust_circle_name