from django.db import models
from django.utils import timezone

class Comments(models.Model):
    
    comment_id = models.AutoField(primary_key=True, serialize=False, verbose_name='ID')
    content = models.TextField()
    user = models.ForeignKey('CustomUsers', on_delete=models.CASCADE, null=True, related_name='user_comments')
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='parent_comments')
    created_at = models.DateTimeField(default=timezone.now)

    
    class Meta:
        db_table = 'Comments'
        verbose_name_plural = "Comments"
        
