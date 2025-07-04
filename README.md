# Employee Directory - Full-Stack Application

A modern, production-ready employee directory application built with Next.js, featuring comprehensive CRUD operations, advanced search and filtering, pagination, and smooth animations.

## 🚀 Features

### Core Functionality
- **Complete CRUD Operations**: Add, view, edit, and delete employees
- **Advanced Search**: Real-time search across names, emails, and job titles
- **Smart Filtering**: Filter by department, location, and employment status
- **Pagination**: Efficient data loading with customizable page sizes
- **Form Validation**: Robust client-side validation using Yup schemas
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### User Experience
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Loading States**: Skeleton loaders and loading indicators
- **Toast Notifications**: User feedback for all actions
- **Modal Forms**: Intuitive overlay forms for data entry
- **Real-time Stats**: Dashboard with live employee statistics

### Technical Features
- **Type Safety**: Full TypeScript implementation
- **Database Integration**: PostgreSQL with Neon serverless
- **API Routes**: RESTful API endpoints with proper error handling
- **Production Ready**: Optimized build and deployment configuration

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Yup** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **SQL** - Direct database queries for optimal performance

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon database account (or any PostgreSQL database)

## 🚀 Setup Instructions

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd employee-directory
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Setup
Create a `.env.local` file in the root directory:

\`\`\`env
DATABASE_URL=your_neon_database_connection_string
\`\`\`

To get your Neon database URL:
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from your dashboard

### 4. Database Setup
The application includes SQL scripts to set up your database schema and sample data.

Run the setup script in your Neon SQL Editor or any PostgreSQL client:
\`\`\`sql
-- The setup script is located in scripts/setup-database.sql
-- It will create the necessary tables and insert sample data
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
\`\`\`bash
npm run build
npm start
# or
yarn build
yarn start
\`\`\`

## 🏗 Project Structure

\`\`\`
employee-directory/
├── app/
│   ├── api/
│   │   ├── employees/
│   │   │   ├── route.ts          # Employee CRUD endpoints
│   │   │   └── [id]/route.ts     # Individual employee operations
│   │   └── departments/
│   │       └── route.ts          # Department data endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── employee-card.tsx        # Employee display card
│   ├── employee-form.tsx        # Add/edit employee form
│   ├── search-filters.tsx       # Search and filter controls
│   └── pagination.tsx           # Pagination component
├── lib/
│   ├── database.ts              # Database connection and types
│   └── validations.ts           # Yup validation schemas
├── scripts/
│   └── setup-database.sql       # Database schema and seed data
└── README.md                    # Project documentation
\`\`\`

## 🔧 API Endpoints

### Employees
- `GET /api/employees` - List employees with search, filtering, and pagination
- `POST /api/employees` - Create new employee
- `GET /api/employees/[id]` - Get specific employee
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Departments
- `GET /api/departments` - List all departments

## 📊 Database Schema

### Employees Table
\`\`\`sql
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100) NOT NULL,
  title VARCHAR(150) NOT NULL,
  location VARCHAR(100) NOT NULL,
  hire_date DATE NOT NULL,
  salary DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'active',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Departments Table
\`\`\`sql
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## 🎨 Key Features Explained

### Form Validation
The application uses Yup for comprehensive form validation:
- Required field validation
- Email format validation
- Phone number format validation
- Date validation (hire date cannot be in future)
- Salary range validation
- String length limits

### Search & Filtering
- **Real-time search**: Debounced search across multiple fields
- **Department filtering**: Filter by specific departments
- **Location filtering**: Filter by office locations
- **Status filtering**: Filter by active/inactive employees
- **Combined filters**: Multiple filters work together

### Pagination
- Configurable page sizes (5, 10, 20, 50)
- Smart pagination controls with ellipsis
- Total count and range display
- URL state preservation

### Animations
- Page transitions with Framer Motion
- Card hover effects
- Form modal animations
- Loading skeleton animations
- Smooth list updates

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `DATABASE_URL` environment variable
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security Features

- Input validation on both client and server
- SQL injection prevention through parameterized queries
- XSS protection through proper data sanitization
- CORS handling
- Environment variable protection

## 🧪 Testing

The application is built with testing in mind:
- TypeScript for compile-time error checking
- Proper error boundaries
- Comprehensive error handling
- Input validation

## 📈 Performance Optimizations

- Server-side pagination to handle large datasets
- Debounced search to reduce API calls
- Optimized database queries
- Image optimization with Next.js
- Code splitting and lazy loading
- Efficient re-renders with React keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your database connection
3. Ensure all environment variables are set
4. Check the GitHub issues page

## 🔮 Future Enhancements

- Employee photo upload
- Advanced reporting and analytics
- Role-based access control
- Email notifications
- Export functionality (CSV, PDF)
- Employee onboarding workflow
- Performance reviews integration
- Organizational chart view
