# Morning Glory Test

Morning Glory Test

## 📦 Tech Stack

- **Frontend Framework:** Next.js (React)
- **Backend Runtime:** Node.js
- **Database ORM:** Prisma
- **Database:** MySQL
- **Language:** TypeScript

---

## 📂 Project Structure

```
.
├── prisma/               # Prisma schema, migrations, and seed
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/              # App router
│   ├── components/       # Reusable UI components
│   └── lib/              # Utility functions
├── .env                  # Environment variables
├── package.json
└── README.md
```

---

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone 
cd your-repo
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="mysql-url"
```

---

## 🗄 Database Setup

### 1️⃣ Run Prisma Migrations

```bash
npx prisma migrate dev
```

### 2️⃣ Generate Prisma Client

```bash
npx prisma generate
```

### 3️⃣ Seed the Database

```bash
npx prisma db seed
```

---

## 🚀 Development

Start the development server:

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---


## 📜 Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `dev`                | Start development server                 |
| `build`              | Build the application for production     |
| `start`              | Start production server                  |
| `lint`               | Run ESLint for code linting              |
| `prisma migrate dev` | Apply database migrations in development |
| `prisma generate`    | Generate Prisma client                   |
| `prisma db seed`     | Seed the database                        |