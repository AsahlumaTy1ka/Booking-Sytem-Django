def admin_context(request):
    """Add admin context variables to all templates"""
    is_admin = request.path.startswith('/site-admin')
    return {
        'is_admin_section': is_admin,
    }
