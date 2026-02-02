import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Ideiglenes fordítások inline, később külön JSON-be szervezzük
const resources = {
    hu: {
        translation: {
            "dashboard.title": "TMS Vezérlőpult",
            "freight.analyze": "Fuvar Elemzése (AI)",
            "freight.origin": "Felrakó",
            "freight.destination": "Lerakó",
            "freight.price": "Ár",
            "status.analyzing": "Elemzés folyamatban...",
            "result.recommendation": "Javaslat",
            "result.confidence": "Biztonság",
            "result.reasoning": "Indoklás"
        }
    },
    de: {
        translation: {
            "dashboard.title": "TMS Dashboard",
            "freight.analyze": "Fracht Analysieren (KI)",
            "freight.origin": "Beladestelle",
            "freight.destination": "Entladestelle",
            "freight.price": "Preis",
            "status.analyzing": "Analysiere...",
            "result.recommendation": "Empfehlung",
            "result.confidence": "Konfidenz",
            "result.reasoning": "Begründung"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "hu", // Alapértelmezett nyelv
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
