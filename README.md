# NestJS Subscription Billing API

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bs-nest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```bash
# Server Configuration
PORT=3000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/bs_nest_db"

# JWT Configuration
JWT_ACCESS_SECRET_KEY="your-super-secret-access-key-here"
JWT_REFRESH_SECRET_KEY="your-super-secret-refresh-key-here"
JWT_ACCESS_EXPIRATION="24h"
JWT_REFRESH_EXPIRATION="7d"
```

**Note**: Replace the placeholder values with your actual configuration:
- Update `DATABASE_URL` with your PostgreSQL connection string
- Generate secure secret keys for JWT tokens
- Adjust expiration times as needed

### 4. Database Setup

#### Generate Prisma Client

```bash
npx prisma generate
```

#### Run Database Migrations

```bash
npx prisma migrate dev --name init
```

#### (Optional) Seed Database

```bash
npx prisma db seed
```

### 6. Create Users
 Create users with POST `/register` endpoint and login using POST `/login` for routes that require auth