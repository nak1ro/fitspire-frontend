/**
 * Auth Feature - Hooks
 */

// Auth Store
export {
    useAuthStore,
    useIsAuthenticated,
    useCurrentUser,
    useAuthToken,
    useAuthLoading,
    useIsHydrated,
} from './useAuthStore';

// OAuth Hooks
export { useGoogleAuth } from './useGoogleAuth';
export { useMicrosoftAuth } from './useMicrosoftAuth';

// Email Auth Hooks
export { useEmailLogin } from './useEmailLogin';
export { useEmailRegister } from './useEmailRegister';
export { useForgotPasswordFlow } from './useForgotPasswordFlow';
