# FleetEgo Agent – Master Roadmap

> **Projekt Küldetés**: Egy modern, mesterséges intelligenciára épülő TMS (Transport Management System) létrehozása, amely valós időben összeköti a fuvarozókat, fuvarszervezőket és alvállalkozókat.

## 1. Alapflotta kezelés
- [x] Sofőrök és vontatók hozzárendelése, csere
- [x] Pótkocsi állapota: rakott / üres kijelzés
- [ ] Vontató/pótkocsi hiba bejelentése sofőr részről
- [ ] Lerakás / felrakás státusz jelentése

## 2. Időalapú nyomon követés és tervezés
- [x] Heti / 2 heti vezetési idő nyilvántartás (EU 561/2006)
- [ ] **Tachográf Integráció (Magas Komplexitás)**:
    - [x] **Fázis 1: Manuális Napló** (Kész): Vezetés/Pihenő rögzítése.
    - [ ] **Fázis 2: .DDD Fájl Feldolgozás**:
        - [x] Fájl feltöltés és tárolás (Biztonságos tárhely).
        - [ ] Proprietary bináris formátum visszafejtése (Python library).
        - [ ] Digitális aláírás ellenőrzése.
        - [ ] Adatpontok kinyerése: Sebesség, Aktivitás, Események (Hibák).
    - [ ] **Fázis 3: Telematika API (Webfleet/Samsara)**:
        - [ ] API Fragmentáció kezelése (Minden gyártó más struktúrát ad).
        - [ ] Valós idejű szinkronizáció (WebSocket/Polling).
- [ ] Fuvarok igazságos elosztása a vezetési idők alapján
- [ ] Fuvartervezés a pihenőidőkkel és szabadságokkal kalkulálva
- [ ] Heti / kétheti tervek automatikus generálása

## 3. Fuvar státusz és dokumentáció
- [ ] Fuvar státusz nyomon követése (felvételre vár / felvéve / úton / lerakva)
- [x] CMR / szállítólevél feltöltése sofőr részéről (fénykép/fájl)
- [ ] Automatikus párosítás a fuvarmegbízással
- [ ] Automatikus számlakészítés a dokumentum alapján

## 4. Kommunikáció és visszajelzés
- [x] Chat alapú kommunikáció sofőr és iroda között
- [x] Irodai chat külön modulban
- [ ] Sofőrök bemutatkozása + képgaléria (cég alá feltöltve)

## 5. Automatizált fuvarfigyelés (AI és Python logika)
- [x] **Timocom API Integráció**: Minden regisztrált cég saját API kulcsát használja.
- [x] Automatikus fuvarfigyelés fuvarbörzéken (pl. 5 percenként)
- [x] Python logika a keresési ciklusokhoz (Mistral 7B szerveren / GPT-5 Mini)
- [ ] FTL / LTL rakományok összevonása optimalizált útvonalra
- [ ] LTL esetén távolság-alapú beszúrás (útvonal menti 150–200 km-es sáv)
- [ ] Ha a fuvarozónak van eladó fuvarja, AI töltse fel jóváhagyás után börzére

## 6. Nyelvi és AI-funkciók
- [ ] Valós idejű nyelvi fordítás (pl. RO–HU, EN–HU)
- [ ] Fuvarleírás értelmezése és továbbítása (írásban + hangban)
- [ ] Hang alapú vezérlés (utasítás, visszajelzés)

## 7. Adminisztratív és pénzügyi funkciók
- [ ] Számlázás modul
- [x] Dokumentumkezelő modul (BYOS, Multi-tenant)
- [ ] Statisztikai riportok (fuvar, bevétel, idő)
- [x] Útvonaltervező modul (OpenRouteService előkészítve)
- [ ] Javítási naptár + automatikus emlékeztetők

## 8. Alvállalkozók kezelése
- [ ] Alvállalkozók hozzárendelése a céghez
- [ ] Kommunikációs csatorna biztosítása
- [ ] Státusz és teljesítmény figyelése
- [ ] Dokumentumok, számlák feltöltése
- [ ] Pénzügyi statisztikák / kintlévőségek nyomon követése

## 9. Regisztrációs és jogosultsági logika
- [x] Ügyfél kezdeményezi a regisztrációt -> Ő lesz a **Cég Admin** (Company Owner)
- [ ] A Cég Admin küld meghívó linket az alkalmazottaknak (Irodisták, Sofőrök)
- [ ] Külön regisztrációs flow a meghívottaknak (automatikusan a céghez rendelve)
- [ ] Jogosultságkezelés: admin / diszpécser / sofőr / alvállalkozó

## 10. Super Admin Dashboard (Központi Vezérlés)
- [x] Felhasználók és Cégek teljes körű kezelése (Jóváhagyás/Tiltás/Szerkesztés)
- [ ] Rendszer beállítások és Globális paraméterek
- [ ] Előfizetések és Számlázás státuszok

## 11. Platform architektúra
- [x] Backend: Python FastAPI + MongoDB (Render Deploy Fix: `load_dotenv` javítva)
- [x] Frontend: React + Vite (Design Renderelve & Helyreállítva + Új "High-Tech Road" Háttér)
- [x] UI/UX: Light Mode javítva, Sidebar, Reszponzivitás, Dinamikus Háttér
- [x] AI Core: OpenAI (GPT-5 / GPT-4o) + Mistral (Opcionális)
- [x] Dokumentumtár: Lokális vagy S3-kompatibilis (BYOS)

---

# PRO TMS ROADMAP KIEGÉSZÍTÉS (KKV – EU, MENÜ‑SZERKEZETHEZ IGAZÍTVA)

> Cél: professzionális, skálázható, EU‑képes KKV TMS létrehozása, amely **nem tákolt** és könnyen white‑label/enterprise irányba fejleszthető.

## 12. Menü‑struktúra és modul‑térkép (alapkeret)
- [ ] Dashboard (KPI + riasztások + “today view”)
- [x] Fuvarok (megbízások, állapot, dokumentumok)
- [x] Flotta (jármű, sofőr, pótkocsi, kapacitás) - Basics Done
- [ ] Tervezés (útvonal, kapacitás, időablak, pihenőidő)
- [x] Fuvarbörze (Timocom + tender + ajánlat)
- [ ] Számlázás (számlák, kintlévőség, export)
- [x] Dokumentumtár (CMR, POD, fuvarlevél)
- [ ] Partnerek (megbízó, alvállalkozó, kontakt)
- [ ] Beállítások (integrációk, jogosultságok, cégadatok)

## 13. Order‑to‑Cash (végigvezetett üzleti folyamat)
- [x] Megbízás létrehozás (manuális + API)
- [x] Fuvar hozzárendelés (sofőr/jármű/alvállalkozó)
- [ ] Végrehajtás (felrakás/lerakás státusz)
- [x] Dokumentálás (CMR/POD)
- [ ] Számlázás (automatikus a dokumentumok alapján)
- [ ] Kintlévőség kezelés (státusz + értesítések)

## 14. Ár‑ és költségmodell (KKV‑barát, EU‑kompatibilis)
- [ ] Alapár + zóna/distance + üzemanyag‑pótdíj
- [ ] Alvállalkozói díj + margin számítás
- [ ] Profitabilitás fuvaronként (bevétel/költség)

## 15. Tender / ajánlatkérés (B2B vállalati alap)
- [ ] RFQ folyamat (ajánlatkérés → ajánlat → elfogadás)
- [ ] Több ajánlat összehasonlítása
- [ ] SLA + teljesítés mérés

## 16. Compliance & dokumentum (EU szükséges)
- [ ] CMR/POD archiválás (jogszabályi megőrzés)
- [ ] ADR, GDP (gyógyszer) jelölések
- [ ] Audit napló (ki‑mit‑mikor)

## 17. Jogosultság és multi‑tenant (white‑label readiness)
- [ ] Finomhangolt szerepkörök (dispatcher, driver, finance, admin)
- [ ] Cég izoláció + konfiguráció per tenant
- [ ] White‑label brand beállítások

## 18. Stabilitás és üzemeltetés (enterprise szint)
- [ ] Retry + queue rendszer minden integrációhoz
- [ ] Health check + monitoring + alerting
- [ ] Incident log / error tracing

## 19. Integrációs mag (bővíthető ökoszisztéma)
- [ ] ERP / WMS / CRM csatlakozási pont
- [ ] Univerzális webhook (számlázó rendszerekhez)
- [ ] IP whitelist / audit

## 20. Lokalizáció (EU piac)
- [ ] Többnyelvű UI
- [ ] Időzóna, pénznem, dátum formátum
- [ ] Ország‑specifikus számla kimenet

## 21. KPI és riporting (vezetői dashboard)
- [ ] Fuvar KPI (késés okai, on‑time, kihasználtság)
- [ ] Pénzügyi KPI (margin, ROI, kintlévőség)
- [ ] Flotta KPI (üzemidő, kihasználtság)

## 22. EU‑n kívüli piacok (TR, RS, WB, UK, stb.)
- [ ] Nem‑EU országok adózási és számla követelmények (pl. TR, RS)
- [ ] Határ‑ és vámfolyamatok (EORI, vám‑státusz, export/import)
- [ ] Lokalizáció kiterjesztése: nyelv + pénznem + jogi mezők
- [ ] Partneri dokumentumok: TIR, CMR kiegészítések
