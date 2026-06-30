from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.db.models import Q, F

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
 
from Matostheque.models.comment_model import Comments
from Matostheque.serializers import CommentSerializer
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view

@login_required
@api_view(['GET', 'POST'])
def comments_operations(request):
    if request.method == 'GET':
        comments = Comments.objects.all().order_by('-created_at')
        comment_serializer = CommentSerializer(comments, many=True)
        serialized_data = comment_serializer.data
        return JsonResponse(serialized_data, safe=False)
 
    elif request.method == 'POST':
        comment_data = request.data 
        comment_serializer = CommentSerializer(data=comment_data)
        if comment_serializer.is_valid():
            comment_serializer.save()
            return JsonResponse(comment_serializer.data, status=status.HTTP_201_CREATED) 
        print(comment_data)
        print(comment_serializer.errors)
        return JsonResponse(comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_child_comments(parent_comment, all_comments):
    child_comments = []
    for comment in all_comments:
        if comment['parent_comment'] == parent_comment:
            # Recursively get child comments for the current comment
            comment['children'] = get_child_comments(comment['comment_id'], all_comments)
            child_comments.append(comment)
    return child_comments

@login_required
@api_view(['GET'])
def get_formatted_comments(request):
    if request.method == 'GET':
        comments = Comments.objects.all().values(
            'comment_id',
            'content',
            'created_at',
            'parent_comment',
            'user',
            user_first_name=F('user__first_name'),
            user_last_name=F('user__last_name'),
        ).order_by('-created_at')

        # Select top-level comments
        top_level_comments = [comment for comment in comments if comment['parent_comment'] is None]

        # For each top-level comment, get its child comments recursively
        formatted_comments = []
        for comment in top_level_comments:
            comment['children'] = get_child_comments(comment['comment_id'], comments)
            formatted_comments.append(comment)

        return JsonResponse(formatted_comments, safe=False)
    
@login_required
@api_view(['PUT', 'DELETE'])
def single_comment_operations(request, pk):
    comment = Comments.objects.filter(pk=pk)
    
    if request.method == 'PUT': 
        comment_data = JSONParser().parse(request) 
        comment_serializer = CommentSerializer(comment, data=comment_data, partial=True) 
        if comment_serializer.is_valid(): 
            comment_serializer.save() 
            return JsonResponse(comment_serializer.data) 
        return JsonResponse(comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
 
    
    elif request.method == 'DELETE':
        try:
            comment_or_404 = get_object_or_404(Comments, pk=pk)
            comment_or_404.delete()
            return JsonResponse({"message": "Comment deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print("Error deleting comment:", str(e))
            return JsonResponse({"error": "Failed to delete comment."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 