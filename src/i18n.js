import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en", // Default to English if detection fails
        supportedLngs: ["hu", "en", "de", "cz", "sk", "ro", "ru", "hr", "pl"],

        backend: {
            loadPath: "/locales/{{lng}}/translation.json",
        },

        interpolation: {
            escapeValue: false
        },

        react: {
            useSuspense: true // Enable suspense for loading translations
        }
    });

export default i18n;
