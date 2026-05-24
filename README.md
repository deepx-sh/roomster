# Roomsters

A full-stack Airbnb-inspired property listing platform built with Node.js, Express, MongoDB, and EJS. Users can browse, create, edit, and review property listings with map integration and image uploads.

---
## Live Demo
[Click here to view the live demo](https://roomster.onrender.com/listings)
---
## Features

- **Browse Listings** - View all properties with category filters (Beach, Mountains, Castles, Luxe, etc.)
- **Search** - Full-text search across title, location, country, and description
- **Authentication** - Signup, login, and logout using Passport.js (local strategy)
- **Create & Manage Listings** - Authenticated users can add, edit, and delete their own listings
- **Image Uploads** - Upload listing images via Cloudinary
- **Reviews & Ratings** - Leave star-rated reviews on listings; only the review author can delete them
- **Map Integration** - Each listing shows its location on an interactive Leaflet map (geocoded via OpenCage)
- **Flash Messages** - Success and error notifications on all key actions
- **Session Persistence** - Sessions stored in MongoDB via `connect-mongo`
- **Tax Toggle** - Show/hide GST breakdown on the listings index page

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Templating | EJS + ejs-mate |
| Auth | Passport.js + passport-local-mongoose |
| File Uploads | Multer + Cloudinary |
| Maps | Leaflet.js + OpenCage Geocoding API |
| Validation | Joi |
| Sessions | express-session + connect-mongo |
| Styling | Bootstrap 5 + custom CSS |

---

## Project Structure

```
backend/
├── app.js                  # Express app entry point
├── cloudConfig.js          # Cloudinary + Multer storage setup
├── middleware.js           # Auth, ownership, and validation middleware
├── schema.js               # Joi validation schemas
├── controllers/
│   ├── listings.js         # Listing CRUD logic
│   ├── review.js           # Review create/delete logic
│   └── user.js             # Signup, login, logout logic
├── models/
│   ├── listing.js          # Listing Mongoose model
│   ├── review.js           # Review Mongoose model
│   └── user.js             # User Mongoose model
├── routes/
│   ├── listingsRoutes.js   # /listings routes
│   ├── reviewsRoutes.js    # /listings/:id/reviews routes
│   └── usersRoutes.js      # /signup, /login, /logout routes
├── utils/
│   ├── wrapAsync.js        # Async error handler wrapper
│   ├── ExpressError.js     # Custom error class
│   └── geocode.js          # OpenCage geocoding helper
├── init/
│   ├── data.js             # Seed data (30 sample listings)
│   └── index.js            # DB seeding script
├── public/
│   ├── css/
│   │   ├── style.css       # Custom styles
│   │   └── rating.css      # Star rating widget styles
│   └── js/
│       ├── script.js       # Bootstrap form validation
│       └── map.js          # Leaflet map initialization
└── views/
    ├── layouts/
    │   └── boilerplate.ejs # Base HTML layout
    ├── includes/
    │   ├── navbar.ejs
    │   ├── footer.ejs
    │   └── flash.ejs
    ├── listings/
    │   ├── index.ejs       # All listings + filters
    │   ├── show.ejs        # Single listing detail + reviews + map
    │   ├── new.ejs         # Create listing form
    │   └── edit.ejs        # Edit listing form
    └── users/
        ├── signup.ejs
        └── login.ejs
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- OpenCage Geocoding API key

### Installation

```bash
# Clone the repository
git clone https://github.com/deepx-sh/roomsters.git
cd roomsters/backend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
ATLASDB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/roomsters
SESSION_SECRET=your_session_secret
SECRET_SESSION_CRYPTO=your_crypto_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
OPENCAGE_API_KEY=your_opencage_api_key
```

### Run the App

```bash
npm start
# Server runs on http://localhost:3001
```

---

## API Routes

### Listings

| Method | Route | Description | Auth Required |
|---|---|---|---|
| GET | `/listings` | All listings (supports `?category=`) | No |
| GET | `/listings/search?q=` | Search listings | No |
| GET | `/listings/new` | New listing form | ✅ |
| POST | `/listings` | Create listing | ✅ |
| GET | `/listings/:id` | Show listing | No |
| GET | `/listings/:id/edit` | Edit listing form | ✅ Owner only |
| PUT | `/listings/:id` | Update listing | ✅ Owner only |
| DELETE | `/listings/:id` | Delete listing | ✅ Owner only |

### Reviews

| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | `/listings/:id/reviews` | Add review | ✅ |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete review | ✅ Author only |

### Users

| Method | Route | Description |
|---|---|---|
| GET/POST | `/signup` | Register |
| GET/POST | `/login` | Login |
| GET | `/logout` | Logout |

---

## Listing Categories

`trending` · `beach` · `cities` · `amazing views` · `mountains` · `nature` · `homestays` · `cabin` · `desert` · `camping` · `luxe` · `historical` · `pools` · `castles`

---

## Security

- Passwords hashed via `passport-local-mongoose` (pbkdf2)
- Sessions encrypted with `kruptein` via `connect-mongo`
- `httpOnly` cookies; `secure` + `sameSite: none` enforced in production
- Ownership checks on all edit/delete operations
- Server-side validation via Joi schemas on all form submissions
