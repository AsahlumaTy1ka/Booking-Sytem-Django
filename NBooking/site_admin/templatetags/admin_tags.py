from django import template

register = template.Library()

@register.filter
def startswith(value, arg):
    """Check if string starts with another string"""
    return str(value).startswith(str(arg))
