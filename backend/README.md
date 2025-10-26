# Rose Chemicals E-commerce Backend

A complete e-commerce backend system built with Node.js, Express, and MongoDB for Rose Chemicals.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations with image uploads and search functionality
- **Shopping Cart**: Full cart management with session persistence
- **Order Processing**: Complete order lifecycle with status tracking
- **Payment Integration**: Razorpay payment gateway integration
- **Admin Dashboard**: Comprehensive admin panel with statistics and management tools
- **CSV Export**: Automated and on-demand CSV generation for orders and products
- **File Uploads**: Multer-based file upload system
- **Security**: Helmet, CORS, and input validation
- **Logging**: Morgan HTTP request logger
- **Performance**: Compression middleware

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── adminController.js   # Admin operations
│   ├── authController.js    # Authentication logic
│   ├── cartController.js    # Cart management
│   ├── orderController.js   # Order processing
│   ├── paymentController.js # Payment handling
│   └── productController.js # Product operations
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   ├── Cart.js             # Cart schema
│   ├── Order.js            # Order schema
│   ├── Product.js          # Product schema
│   └── User.js             # User schema
├── routes/
│   ├── admin.js            # Admin routes
│   ├── auth.js             # Authentication routes
│   ├── cart.js             # Cart routes
│   ├── orders.js           # Order routes
│   ├── payment.js          # Payment routes
│   └── products.js         # Product routes
├── uploads/                # File upload directory
├── exports/                # CSV export directory
├── utils/
│   └── csvGenerator.js     # CSV generation utilities
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
└── server.js              # Main server file
```

## 🔧 Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory based on `.env.example`:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/rose-chemicals
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/rose-chemicals

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server Configuration
NODE_ENV=development
PORT=5000

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Admin Configuration
ADMIN_EMAIL=admin@rosechemicals.com
ADMIN_PASSWORD=Admin@123
```

### 3. Database Setup

Make sure MongoDB is running on your system:

- **Local MongoDB**: Start MongoDB service
- **MongoDB Atlas**: Update MONGO_URI with your cluster connection string

### 4. Start the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Admin |
| PATCH | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user's cart | Yes |
| POST | `/api/cart/add` | Add item to cart | Yes |
| PATCH | `/api/cart/update` | Update cart item | Yes |
| DELETE | `/api/cart/remove` | Remove cart item | Yes |
| DELETE | `/api/cart/clear` | Clear entire cart | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create new order | Yes |
| GET | `/api/orders/my-orders` | Get user's orders | Yes |
| GET | `/api/orders/:id` | Get single order | Yes |
| PATCH | `/api/orders/:id/status` | Update order status | Admin |

### Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payment/create-order` | Create payment order | Yes |
| POST | `/api/payment/verify` | Verify payment | Yes |
| GET | `/api/payment/status/:orderId` | Get payment status | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard/stats` | Get dashboard statistics | Admin |
| PATCH | `/api/admin/inventory/update` | Update inventory | Admin |
| GET | `/api/admin/export/orders` | Export orders CSV | Admin |
| GET | `/api/admin/export/products` | Export products CSV | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/orders` | Get all orders | Admin |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```javascript
Authorization: Bearer <your_jwt_token>
```

## 💳 Payment Integration

The system integrates with Razorpay for payment processing:

1. **Create Payment Order**: Generate Razorpay order
2. **Process Payment**: Handle payment through Razorpay checkout
3. **Verify Payment**: Verify payment signature and update order status

## 📊 CSV Export Features

- **Automated Exports**: CSV files generated every 2 hours
- **On-demand Exports**: Manual CSV generation through admin panel
- **Auto Cleanup**: Old CSV files (30+ days) automatically deleted
- **Export Types**: Orders and Products CSV exports

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and user role separation
- **Input Validation**: Express-validator for request validation
- **Security Headers**: Helmet.js for security headers
- **CORS**: Cross-origin resource sharing configuration
- **Password Hashing**: bcryptjs for secure password storage

## 🚀 Frontend Integration

### React Integration Example

1. **Install dependencies in your React frontend**:
```bash
npm install axios
```

2. **Copy the API service file** (`frontend-api-integration.js`) to your React project as `src/services/api.js`

3. **Set up environment variables** in your React `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. **Example component usage**:
```jsx
import React, { useState, useEffect } from 'react';
import { productsAPI, cartAPI } from '../services/api';

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getProducts();
        setProducts(response.products);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      await cartAPI.addToCart(productId, 1);
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => addToCart(product._id)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 🔄 Available Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Install dependencies
npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify network connectivity for MongoDB Atlas

2. **Port Already in Use**:
   - Change PORT in .env file
   - Kill existing process on port 5000

3. **File Upload Issues**:
   - Ensure uploads/ directory exists
   - Check file permissions
   - Verify MAX_FILE_SIZE setting

4. **Razorpay Integration**:
   - Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
   - Ensure Razorpay webhook URL is configured
   - Check payment verification signature

## 📝 Testing

Use tools like Postman or Thunder Client to test the API endpoints:

1. **Register/Login** to get JWT token
2. **Set Authorization header** with Bearer token
3. **Test CRUD operations** on products, cart, and orders
4. **Test payment flow** with Razorpay test credentials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: support@rosechemicals.com
- Documentation: Check API documentation above
- Issues: Create GitHub issue for bugs and feature requests
