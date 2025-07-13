# 📢 Online Advertisements App

Full Stack web aplikacija za online oglašavanje – korisnici mogu da postavljaju, pretražuju, uređuju i brišu oglase. Aplikacija omogućava autentifikaciju, autorizaciju, prikaz detalja i filtriranje oglasa po različitim kriterijumima. Aplikacija je osnova za sve ostale moguće implementacije kojih ima mnogo.

---
Testirana aplikacija: [Demo](https://www.youtube.com/watch?v=I_Apy5U9VOg&ab_channel=%D0%A0%D0%B0%D0%B4%D0%BE%D1%81%D0%BB%D0%B0%D0%B2%D0%9C%D0%B0%D1%81%D1%82%D0%B8%D0%BB%D0%BE%D0%B2%D0%B8%D1%9B)

## 🚀 Pokretanje projekta lokalno

### 1. Kloniraj repozitorijum

```bash
git clone https://github.com/MastilovicRadoslav/Online_Advertising.git
cd Online_Advertising
```

### 2. Pokreni backend (Express.js + MongoDB)

```bash
cd backend
npm install
```

🔧 U `.env` fajlu postavi konekciju ka tvojoj MongoDB bazi:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/oglasi-db
JWT_SECRET=tajnitoken123
```

Zatim pokreni backend:

```bash
node server.js
```

API će biti dostupan na: [http://localhost:5000](http://localhost:5000)

### 3. Pokreni frontend (React + Ant Design)

```bash
cd frontend
npm install
npm run dev
```

Frontend će biti dostupan na: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Seedovanje baze (opciono)

Pokreni sledeći skript kako bi ubacio test korisnike i oglase (BONUS):

```bash
node seed.js
```

---

## 🧩 Funkcionalnosti

✅ Registracija i login korisnika  
✅ Prikaz svih oglasa sa paginacijom  
✅ Filtar po naslovu, kategoriji i cjenovnom opsegu  
✅ Prikaz samo mojih oglasa  
✅ Dodavanje, izmjena i brisanje oglasa (samo za vlasnika)  
✅ Detaljan prikaz oglasa sa informacijama o korisniku  
✅ Responsivan dizajn pomoću Ant Design sistema  

---

## 🗃️ Struktura projekta

```bash
Online_Advertising/
├── backend/              # Express + MongoDB backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   └── .env
├── frontend/             # React + Ant Design frontend
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── styles/
│   └── main.jsx
├── Project specification
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Tehnologije

**Frontend:** React, Ant Design, Axios, React Router  
**Backend:** Express.js, MongoDB, Mongoose  
**Autentifikacija:** JWT  
**UI dizajn:** Ant Design  

---

## 👤 Autor

Radoslav (Ćole)  
[LinkedIn profil](https://www.linkedin.com/in/radoslav-mastilovi%C4%87-1022a020b/)

---

## 🛡️ Napomena

⚠️ Aplikacija implementira osnovnu zaštitu ruta i dozvola, ali za produkciju je preporučeno dodatno osiguranje (HTTPS, rate limiting, sanitizacija ulaza itd).
