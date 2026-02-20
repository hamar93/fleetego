# FleetEgo Agent – ROADMAP V2 (Market Winning Edition)

## Projekt küldetés

A FleetEgo célja nem egy újabb TMS rendszer építése.

A FleetEgo célja egy **AI-alapú Dispatch Copilot platform**, amely:

- automatizálja a diszpécser napi döntéseinek 80%-át
- Timocom integrációval azonnali fuvarlehetőséget ad
- e-CMR + POD workflow-val gyorsítja a cashflow-t
- EU561 compliant tervezést biztosít
- KKV-knak 1 nap alatt bevezethető

---

# PRIORITY ZERO — TIMOCOM DEMO SPRINT (Partner Validation)

## Cél
10–14 nap alatt egy működő demo környezet, amit a Timocom account manager és tech team is lát.

## Output
- élő fuvarlista
- AI értelmezett fuvaradatok
- ajánlatküldés workflow
- compliance logok

### 0.1 Live Freight Watcher Dashboard
- [x] Timocom API → találatok UI listában
- [x] Szűrés profil szerint (ország, távolság, típus)

DONE ha:
- diszpécser látja a friss fuvarokat valós időben

---

### 0.2 AI Freight Interpreter
Feladat:
- nyers fuvarleírás → strukturált adat

Input:
- Timocom description text

Output:
- pickup city
- delivery city
- weight/pallet
- price hint
- ADR/GDP flag

DONE ha:
- [x] 10 különböző fuvarból 8-at jól felismer (Mock teszttel verifikálva, éles kulcsra vár)

---

### 0.3 One-Click Offer Workflow
- [x] ajánlat gomb → ár megadás → küldés

DONE ha:
- diszpécser 30 mp alatt ajánlatot küld

---

### 0.4 Compliance Layer (Timocom safe mode)
- [x] request logging <!-- Basic logging model exists -->
- [ ] rate-limit monitor
- [x] retry queue integrációknál <!-- tenacity @retry a timocom_client.py-ban -->

DONE ha:
- API policy nem sérül és auditálható

---

# 1. Core Fleet Management (Existing Base)

## Cél
Flotta alapadatok kezelése.

- [x] Sofőr ↔ vontató hozzárendelés <!-- Refined: Kocsigazda logika -->
- [x] Pótkocsi állapot: üres/rakott <!-- VehicleType=Trailer -->
- [x] Hibabejelentés sofőr részről
- [x] Pótkocsi ↔ Vontató csatolás <!-- NEW: Core Fleet Refinement -->
- [x] Felrakás / lerakás státusz

AGENT NOTE:
Ez a modul a Dispatch Copilot input adatforrása.

---

# 2. DISPATCH COPILOT LAYER (Market Winning Core)

## Cél
FleetEgo = diszpécser második agya.

### 2.1 Exception Engine
- [x] “Fuvar veszélyben” riasztások <!-- Compliance riasztások (9h/10h/Wk) működnek -->

Trigger:
- késés
- sofőr nem reagál
- vezetési idő kifutás

DONE ha:
- rendszer előbb jelez, mint hogy baj lesz

---

### 2.2 EU561 Legal Planner
- [x] AI tervezés pihenőidőkkel <!-- Compliance Engine & Dispatch Calendar kész -->

Output:
- legális útvonal + dispatch terv
- vizuális idővonal (Dispatch Calendar)

DONE ha:
- nem javasol szabálytalan vezetést

---

# 3. Tachograph & Telematics (Existing + Upgrade)

- [x] Manuális vezetési napló
- [x] .DDD file feldolgozás alap
- [ ] Digitális aláírás ellenőrzés
- [ ] Webfleet/Samsara integráció

AGENT NOTE:
A telematika később real-time ETA motor alapja.

---

# 4. DOCUMENT + CASHFLOW ENGINE (Killer Feature) <!-- NEXT UP -->

## Cél
A fuvar után azonnali pénzáramlás.

- [x] CMR/POD feltöltés
- [x] Automatikus párosítás fuvarral
- [x] POD → Instant Invoice workflow <!-- COMPLETED -->

DONE ha:
- lerakás után 5 percen belül számla kész

---

# 5. Freight Offer Automation (Timocom + AI)

- [x] Timocom API search
- [x] AI price suggestion <!-- pricing_service.py: market reference + profitability -->
- [x] ajánlat sablonok
- [ ] Partner Risk Score

DONE ha:
- ajánlatküldés 10x gyorsabb mint manuálisan

---

# 6. Slot Booking + Yard Waiting Killer

## Cél
Várakozási idők csökkentése.

- [x] ETA alapú időkapu foglalás
- [ ] újrafoglalás késés esetén
- [ ] waiting time riport

DONE ha:
- csökken a rakodási várakozás

---

# 7. Anti-Excel Onboarding (Go-to-Market Weapon)

## Cél
KKV 1 nap alatt bevezeti.

- [ ] Excel import wizard
- [ ] AI mezőfelismerés
- [ ] automatikus dispatch board generálás

DONE ha:
- Excelből 15 perc alatt FleetEgo rendszer lesz

---

# 8. Subcontractor Marketplace + Trust Score

- [ ] alvállalkozók kezelése
- [ ] teljesítmény scoring
- [ ] ajánlott partner hálózat

DONE ha:
- FleetEgo “trusted network” platformmá válik

---

# 9. ESG + CO₂ Tender Module

## Cél
Tender belépő funkció.

- [ ] CO₂ számítás fuvaronként
- [ ] ESG export riport

DONE ha:
- ügyfél tenderben felhasználja

---

# 10. Platform Integration Core (Moat)

- [ ] ERP/WMS connector framework
- [ ] webhook rendszer
- [ ] plugin-ready architektúra

DONE ha:
- FleetEgo platformként működik, nem csak appként

---

# 11. Pricing & Packaging

Ajánlott modell:

- Starter (1–5 truck)
- Pro (5–25 truck)
- Enterprise

Per-truck pricing, nem per-user.

---

## FleetEgo Identity

FleetEgo = AI Dispatch Copilot + Timocom Automation + e-CMR Cashflow Engine

A cél:
KKV fuvarozók számára enterprise szintű rendszer, Excel helyett.
