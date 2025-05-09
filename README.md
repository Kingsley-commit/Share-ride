# Share-Ride

**Share-Ride/Ride-Pal** is a Node.js/Express backend API for a share-ride platform. It lets passengers and drivers register, publish and join routes, start rides, rate each other, and handles email verification, image uploads, and geocoding via Mapbox.

---

## 🔍 Features

- **Authentication & Authorization**  
  - JWT-based signup/sign-in for Admin / Driver / Passenger  
  - Email verification for new users  
  - Role-based guards for protected routes

- **Ride Routing**  
  - Drivers can publish routes with Mapbox geocoding & polyline  
  - Passengers can view and join published routes  
  - Drivers can start/end rides and view passenger lists

- **Ratings & Reviews**  
  - After ride completion, both parties can rate each other

- **Email & Notifications**  
  - Verification, password resets, ride alerts via Nodemailer + Handlebars templates

- **Media Uploads**  
  - Vehicle & profile images handled by Multer + Cloudinary

- **Error Handling & Logging**  
  - Centralized error middleware  
  - Winston logger

- **Database**  
  - PostgreSQL + Sequelize ORM for models & associations

- **Containerization**  
  - Dockerfile provided for easy Docker image build

---

## 🚀 Getting Started

### 1. Clone the repo  
```bash
git clone https://github.com/<your-username>/ride-pal.git
cd ride-pal
````

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the project root with at least:

```dotenv
# Server
PORT=4000
NODE_ENV=development

# Database (PostgreSQL)
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_pass
DB_NAME=ride_pal
DB_PORT=5432

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

# Email (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your_email_password
EMAIL_FROM="Ride-Pal <no-reply@ride-pal.com>"

# Mapbox
MAPBOX_TOKEN=your_mapbox_access_token

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Database Setup

1. Create a PostgreSQL database named `ride_pal` (or your chosen `DB_NAME`).
2. Ensure the credentials in `.env` match.
3. On first run, Sequelize will auto‐sync models.

### 5. Run the Server

* **Development** (with auto-reload):

  ```bash
  npm run dev
  ```

* **Production**:

  ```bash
  npm start
  ```

The API will listen on `http://localhost:${PORT}` (default 4000).

---

## 📚 API Overview

> **Base URL:** `http://localhost:4000/api/v1`

### Auth

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/auth/signup`       | Create passenger or driver |
| POST   | `/auth/signin`       | User login                 |
| GET    | `/auth/verify-email` | Verify user’s email token  |

### Users

* **Driver**

  * `GET /driver/vehicle`
  * `POST /driver/signup`

* **Passenger**

  * `POST /passenger/signup`

### Routes & Rides

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| POST   | `/routes/publish`    | Driver publishes a new route      |
| GET    | `/routes/select`     | Passenger views available routes  |
| POST   | `/routes/join`       | Passenger joins a published route |
| POST   | `/routes/start-ride` | Driver marks ride as started      |

### Rating

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| POST   | `/ratings/give-rating` | Give rating after ride |

*For full docs, see the JSDoc comments in* `src/` *or integrate Swagger.*

---

## 🛠️ Docker

To build and run in a container:

```bash
docker build -t ride-pal .
docker run -p 4000:4000 \
  --env-file .env \
  ride-pal
```

---

## 📦 Tech Stack

* **Runtime & Framework:** Node.js, Express
* **ORM & DB:** Sequelize, PostgreSQL
* **Auth & Validation:** JSON Web Tokens, Joi, bcrypt
* **Maps & Geocoding:** Mapbox SDK
* **File Uploads:** Multer & Cloudinary
* **Email Templates:** Handlebars, Nodemailer
* **Logging:** Winston
* **Containerization:** Docker

---

## 🤝 Contributing

1. Fork it ([https://github.com/your-username/ride-pal/fork](https://github.com/your-username/ride-pal/fork))
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---
