// Validation helper functions for forms
// Use getValidationPatterns() with useTranslations hook for i18n support

// React Hook Form validation patterns with translation support
export const getValidationPatterns = (t: (key: string) => string) => ({
    required: {
        value: true,
        message: t("validation.required"),
    },

    email: {
        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: t("validation.invalidEmail"),
    },

    minLength2: {
        value: 2,
        message: t("validation.minChar2"),
    },

    minLength8: {
        value: 8,
        message: t("validation.minChar8"),
    },
});

// Helper for password match validation
export const getPasswordMatchValidator = (t: (key: string) => string, password: string) => ({
    validate: (value: string) => value === password || t("validation.passwordMismatch"),
});
