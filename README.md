# 📚 Book Management REST API

This is a simple RESTful API for managing a library's book collection, built with **Node.js** and **Express.js**. The API supports basic CRUD operations, advanced filtering, pagination, and features like borrowing and returning books.

## 🔧 Technologies Used

- **Node.js** – JavaScript runtime environment
- **Express.js** – Web framework for Node.js
- **Postman** – Used for API testing https://www.postman.com/downloads/
- **JSON** – For data storage (in-memory for now)

## 📦 Features

- View all books with filtering & pagination
- View detailed info of a specific book
- Add new books with validation
- Update book info (partial updates supported)
- Delete books from the system
- Borrow a book (with borrow/return date logic)
- Return a borrowed book
- Error and 404 handling for clean responses

## 🧪 API Endpoints

| Method | Endpoint                 | Description                        |
|--------|--------------------------|------------------------------------|
| GET    | `/books`                 | Get all books (with filters)       |
| GET    | `/books/:id`            | Get a single book by ID            |
| POST   | `/books`                | Add a new book                     |
| PUT    | `/books/:id`           | Update a book                      |
| DELETE | `/books/:id`           | Delete a book                      |
| POST   | `/books/:id/borrow`    | Borrow a book                      |
| POST   | `/books/:id/return`    | Return a book                      |

## 📌 Filters Supported on `GET /books`

- `available=true/false` → Filter by availability
- `genre=Fiction` → Filter by genre
- `search=keyword` → Search by title/author
- `page=1&limit=10` → Pagination support

## 📚 Internship Details

This project was developed as part of the **Task 2** during my internship at **CODTECH**.  
Intern Name: **Dnyandev Rama Zagade**  
Internship Duration: *Summer Internship 2025*  
Project Title: *DESIGN A RESTFUL API FOR A
LIBRARY OR INVENTORY SYSTEM,
IMPLEMENTING CRUD OPERATIONS.*

SCREEN SHOTS
<img width="1483" height="765" alt="Screenshot 2025-07-18 171135" src="https://github.com/user-attachments/assets/5590f9a3-fe5c-47cf-9eaf-9c180aada382" />
<img width="1919" height="1199" alt="Screenshot 2025-07-18 170857" src="https://github.com/user-attachments/assets/d8b4021a-6800-422d-b699-c03d57236a90" />



