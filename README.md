# 📚 BookHub — Online Book Delivery Management System

<div align="center">

![BookHub Banner](https://i.ibb.co.com/v6Jf66L7/Screenshot-2026-06-26-230829.png)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-BookHub-fc4a32?style=for-the-badge)](https://book-hub-liart.vercel.app)
[![Client Repo](https://img.shields.io/badge/GitHub-Client_Repo-181717?style=for-the-badge&logo=github)](https://github.com/LingkonDash/book-hub)
[![Server Repo](https://img.shields.io/badge/GitHub-Server_Repo-181717?style=for-the-badge&logo=github)](https://github.com/LingkonDash/book-hub-server)

</div>

---

## 📖 About The Project

**BookHub** is a full-stack Online Book Delivery Management System where readers can browse a curated library, pay a delivery fee via Stripe, and have physical books delivered to their doorstep. Librarians manage their book listings and track delivery statuses. Admins oversee the entire platform — approving books, managing users, and monitoring transactions.

The project was built independently as a university assignment (A10_CAT-004) with a complete role-based ecosystem across three user types: **Reader**, **Librarian**, and **Admin**.

---

## 🌐 Live Demo

🔗 **[https://book-hub-liart.vercel.app](https://book-hub-liart.vercel.app)**

### 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@gmail.com` | `Admin@123` |
| 📚 Librarian | `librarian@gmail.com` | `Abc@1234` |
| 📖 Reader | `Reader@gmail.com` | `Abc@1234` |

---

## ✨ Key Features

### 🌍 Public
- Browse all published books with **server-side pagination**
- **Search** by title or description
- **Filter** by category (Fiction, Sci-Fi, Mystery, Biography, etc.)
- **Sort** by latest, delivery fee (low/high), or availability
- View detailed book pages with reviews and delivery info
- Home page with featured books, librarian profiles, and category sections

### 📖 Reader
- Register and log in securely (email/password or Google OAuth)
- Request book delivery via **Stripe** payment
- Track delivery status: `Pending → Dispatched → Delivered`
- View complete delivery and transaction history
- Leave a review **only after** a book has been delivered
- Edit or delete own reviews

### 📚 Librarian
- Add new book listings with cover image upload via **imgBB**
- Books require admin approval before going live (`Pending → Published`)
- Edit own books (re-enters approval queue after edit)
- Toggle books between `Published` and `Unpublished`
- View and manage all deliveries for their books
- Advance delivery status step by step

### 👑 Admin
- View platform-wide stats (users, books, revenue, deliveries)
- **Approve or reject** pending book submissions
- Forcibly unpublish or delete any book
- View and manage all users — change roles or delete accounts
- View all transactions across the platform

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| [Next.js 14](https://nextjs.org/) (App Router) | React framework with server components |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [HeroUI](https://heroui.com/) | Component library |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Better Auth](https://better-auth.com/) | Authentication (email + Google OAuth) |
| [Stripe.js](https://stripe.com/) | Payment processing |
| [Recharts](https://recharts.org/) | Dashboard data visualizations |
| [React Icons](https://react-icons.github.io/react-icons/) | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| [Express.js](https://expressjs.com/) | REST API server |
| [MongoDB](https://www.mongodb.com/) | Database |
| [jose-cjs](https://github.com/panva/jose) | JWT verification via JWKS |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management |
| [cors](https://github.com/expressjs/cors) | Cross-origin requests |

### Services
| Service | Purpose |
|---------|---------|
| [Vercel](https://vercel.com/) | Frontend deployment |
| [imgBB](https://imgbb.com/) | Book cover image hosting |
| [Stripe](https://stripe.com/) | Delivery fee payments |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud database |

---

## 🗂️ Project Structure

```
📦 BookHub (Client)
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── books/
│   │   ├── page.jsx              ← Browse all books (paginated)
│   │   └── [id]/page.jsx         ← Single book detail
│   ├── dashboard/
│   │   ├── user/
│   │   │   ├── page.jsx          ← User overview
│   │   │   ├── deliveries/       ← Delivery history
│   │   │   ├── transactions/     ← Payment history
│   │   │   └── reviews/          ← My reviews
│   │   ├── librarian/
│   │   │   ├── page.jsx          ← Librarian overview
│   │   │   ├── my-books/         ← Manage books
│   │   │   ├── add-book/         ← Add new book
│   │   │   └── deliveries/       ← Manage deliveries
│   │   └── admin/
│   │       ├── page.jsx          ← Admin overview + stats
│   │       ├── users/            ← Manage all users
│   │       ├── books/            ← Approve/reject books
│   │       └── transactions/     ← All transactions
│   └── page.jsx                  ← Home page
├── components/
├── lib/
    ├── auth.js                   ← Better Auth config
    └── auth-client.js            ← Client-side auth

```

```
📦 BookHub (Server)
└── index.js                      ← All API routes + middleware
```

---

## 🔐 API Routes Overview

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | Paginated books with search, filter & sort |
| GET | `/books/:id` | Single book detail |
| GET | `/featured-books` | Homepage featured books |
| GET | `/reviews/:bookId` | Reviews for a book |

### User Protected 🔒
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/deliveries/:uid` | User's delivery history |
| GET | `/user/transactions/:uid` | User's payment history |
| POST | `/deliveries` | Create delivery after payment |
| POST | `/transactions` | Save Stripe transaction |

### Librarian Protected 📚
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/librarian/books` | Librarian's own books |
| POST | `/librarian/books` | Add new book |
| PATCH | `/librarian/books/:id` | Edit a book |
| PATCH | `/librarian/books/:id/toggle` | Toggle publish/unpublish |
| GET | `/librarian/deliveries` | Deliveries for librarian's books |
| PATCH | `/librarian/deliveries/:id/status` | Advance delivery status |

### Admin Protected 👑
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | All users |
| PATCH | `/admin/users/:id/role` | Change user role |
| DELETE | `/admin/users/:id` | Delete a user |
| GET | `/admin/books` | All books (all statuses) |
| PATCH | `/admin/books/:id/approve` | Approve a book |
| PATCH | `/admin/books/:id/reject` | Reject a book |
| DELETE | `/admin/books/:id` | Delete a book |
| GET | `/admin/transactions` | All transactions |
| GET | `/admin/stats` | Platform statistics |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI
- Stripe account (publishable + secret key)
- imgBB API key
- Google OAuth credentials (for Google login)

### 1. Clone the repos

```bash
# Client
git clone https://github.com/LingkonDash/book-hub.git
cd book-hub

# Server
git clone https://github.com/LingkonDash/book-hub-server.git
cd book-hub-server
```

### 2. Client environment variables

Create `.env.local` in the client root:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000

# Better Auth
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# MongoDB
MONGODB_URI=your_mongodb_atlas_uri

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# imgBB
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
```

### 3. Server environment variables

Create `.env` in the server root:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
CLIENT_URL=http://localhost:3000
```

### 4. Install and run

```bash
# Client
npm install
npm run dev

# Server (separate terminal)
npm install
node index.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Data Flow

```
User pays via Stripe
       ↓
Stripe redirects to /success
       ↓
Client calls POST /transactions + POST /deliveries
       ↓
Delivery created with status: "pending"
       ↓
Librarian changes status: pending → dispatched → delivered
       ↓
User can now leave a review for the book ✅
```

---

## 📸 Screenshots

> Screenshots from the live deployment at [book-hub-liart.vercel.app](https://book-hub-liart.vercel.app)

### 🏠 Home Page
![Home Page](https://i.ibb.co.com/Xr73YzWq/home-page.png)

### 📚 Browse Books
![Browse Books](https://i.ibb.co.com/bgb5ZgQp/browse-book.png)

### 👤 User Dashboard
![User Dashboard](https://i.ibb.co.com/FkHzfJg3/reader-dashboard.png)

### 📖 Librarian Dashboard
![Librarian Dashboard](https://i.ibb.co.com/kgtmkCFV/librarian-dashboard.png)

### 👑 Admin Dashboard
![Admin Dashboard](https://i.ibb.co.com/gZJJ03m8/admin-dashboard.png)

---

## 👨‍💻 Author

**Lingkon Dash**

[![GitHub](https://img.shields.io/badge/GitHub-LingkonDash-181717?style=flat&logo=github)](https://github.com/LingkonDash)

---

<div align="center">
  Made with ❤️ for the love of books and code
</div>