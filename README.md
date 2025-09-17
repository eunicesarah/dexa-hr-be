# dexa-hr-be

## How to use

1. Clone the repository
```bash
git clone <repository-url>
cd dexa-hr-be
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=dexa_hr
JWT_SECRET=your_jwt_secret
PORT=8080
```

5. Set up the database
```bash
mysql -u root -p
CREATE DATABASE dexa_hr
```

6. Start the server
```bash
npm start
```

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/users/login` | No | User login |
| POST | `/users/register` | No | User registration |

### Employee Endpoints
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/employees/` | Admin | Create new employee | 
| GET | `/employees/` | Admin | Get list of employees |
| GET | `/employees/profile` | Employee | Get logged-in employee profile | 
| PUT | `/employees/profile` | Employee | Update logged-in employee profile |
| GET | `/employees/admin/:id` | Admin | Get employee by ID (admin) | 
| PUT | `/employees/admin/:id` | Admin | Update employee (admin) |
| PUT | `/employees/:id` | Employee | Update employee |
| DELETE | `/employees/:id` | Admin | Delete employee |

### Attendance Endpoints
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/attendences/` | Employee | Clock in attendance |
| GET | `/attendences/` | Admin | Get list of all attendances |
| GET | `/attendences/employee/:employee_id` | Admin | Get attendance by employee ID | 
| GET | `/attendences/my-attendance` | Employee | Get logged-in user's attendance |
| GET | `/attendences/today` | Employee | Check if user clocked in today |