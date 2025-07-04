# Employee Directory

A modern, responsive employee directory application built with Next.js, Redux Toolkit, and shadcn/ui components. This application provides a comprehensive solution for managing employee information with advanced search, filtering, and CRUD operations.

## ✨ Features

### Core Functionality
- **Employee Management**: Create, read, update, and delete employee records
- **Advanced Search**: Real-time search across employee names, emails, and job titles
- **Smart Filtering**: Filter employees by department and location
- **Pagination**: Efficient data loading with customizable page sizes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### User Experience
- **Modern UI**: Clean, professional interface using shadcn/ui components
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Loading States**: Skeleton loaders and loading indicators
- **Success Feedback**: Toast notifications and success modals
- **Confirmation Dialogs**: Safe deletion with confirmation prompts

### Technical Features
- **State Management**: Redux Toolkit for predictable state management
- **Form Validation**: React Hook Form with Yup schema validation
- **TypeScript**: Full type safety throughout the application
- **API Integration**: RESTful API integration with error handling
- **Optimistic Updates**: Immediate UI feedback with server synchronization

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling and validation
- **Yup** - Schema validation
- **Framer Motion** - Animations and transitions
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI component library

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications
- **Class Variance Authority** - Component variants

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd employee-directory
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Environment Setup**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # Redux provider
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── AddEmployeeModal.tsx
│   ├── EditEmployeeModal.tsx
│   ├── EmployeeCard.tsx
│   ├── EmployeeList.tsx
│   ├── FilterBar.tsx
│   ├── Pagination.tsx
│   ├── SearchBar.tsx
│   ├── SuccessModal.tsx
│   └── ConfirmationDialog.tsx
├── store/                 # Redux store
│   ├── store.ts          # Store configuration
│   └── slices/           # Redux slices
│       └── employeeSlice.ts
├── services/             # API services
│   └── api.ts           # Employee API
├── types/               # TypeScript types
│   └── employee.ts      # Employee interfaces
├── lib/                 # Utilities
│   └── utils.ts         # Helper functions
└── hooks/               # Custom hooks
    └── use-toast.ts     # Toast hook
\`\`\`

## 🔧 API Integration

The application expects a REST API with the following endpoints:

### Employee Endpoints
- \`GET /api/v1/employees\` - Fetch employees with pagination and filters
- \`POST /api/v1/employees\` - Create new employee
- \`PUT /api/v1/employees/:id\` - Update employee
- \`DELETE /api/v1/employees/:id\` - Delete employee

### Query Parameters
- \`page\` - Page number for pagination
- \`limit\` - Number of items per page
- \`search\` - Search term for name, email, or title
- \`department\` - Filter by department
- \`location\` - Filter by location

## 📊 Employee Data Model

\`\`\`typescript
interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  department: string
  location: string
  hireDate: string
  salary: number
  avatar?: string
  createdAt: string
  updatedAt: string
}
\`\`\`

## 🎨 UI Components

### Key Components
- **EmployeeCard**: Individual employee display with actions
- **EmployeeList**: Grid layout with loading states
- **SearchBar**: Real-time search with debouncing
- **FilterBar**: Department and location filters
- **AddEmployeeModal**: Form for creating new employees
- **EditEmployeeModal**: Form for updating employee data
- **Pagination**: Navigation between pages
- **SuccessModal**: Success feedback with animations
- **ConfirmationDialog**: Safe deletion confirmation

### Design System
- **Colors**: Neutral palette with blue accents
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: ARIA labels and keyboard navigation

## 🔍 Features Deep Dive

### Search & Filter
- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Multi-field Search**: Searches across name, email, and job title
- **Combined Filters**: Search and filters work together
- **Clear Filters**: Easy reset functionality

### Form Validation
- **Real-time Validation**: Immediate feedback on form errors
- **Schema Validation**: Yup schemas for consistent validation rules
- **Phone Number Validation**: International phone number support
- **Email Validation**: RFC-compliant email validation

### State Management
- **Normalized State**: Efficient data structure
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Graceful error states
- **Loading States**: Comprehensive loading indicators

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Optimized bundle size
- **Memoization**: React.memo and useMemo where appropriate
- **Debounced Search**: Reduced API calls
- **Skeleton Loading**: Improved perceived performance

## 🧪 Development

### Available Scripts
- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript checks

### Code Quality
- **TypeScript**: Full type coverage
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interactions
- Mobile-optimized modals and forms
- Swipe gestures where appropriate

## 🔒 Security Considerations

- **Input Validation**: Client and server-side validation
- **XSS Prevention**: Sanitized user inputs
- **CSRF Protection**: Token-based protection
- **API Security**: Proper error handling without data leaks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📞 Support

For support, email support@company.com or create an issue in the repository.

---

**Built with ❤️ using modern web technologies**
