export function hasAdminRole(roles?: readonly string[] | null) {
    return roles?.includes('Admin') ?? false;
}
