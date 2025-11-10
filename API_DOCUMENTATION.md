# 🔗 API Documentation - Alrabie Real Estate

## 📋 Overview
This document describes the enhanced API service for the Alrabie Real Estate application.

## 🚀 Base Configuration
- **Base URL**: `http://localhost:3003/api`
- **Timeout**: 15 seconds
- **Content-Type**: `application/json`

## 🔐 Authentication
The API uses JWT tokens for authentication. Tokens are automatically included in requests.

### Auth Endpoints
```javascript
// Login
const response = await apiService.auth.login({ email, password });

// Register
const response = await apiService.auth.register(userData);

// Logout
apiService.auth.logout();

// Check authentication status
const isAuth = apiService.auth.isAuthenticated();

// Get current user
const user = apiService.auth.getCurrentUser();
```

## 🏠 Properties API

### Get All Properties
```javascript
const properties = await apiService.properties.getAll({
  type: 'villa',           // villa, apartment, commercial, office, land
  purpose: 'sale',         // sale, rent
  emirate: 'ajman',        // ajman, dubai, sharjah, etc.
  price_min: 500000,       // minimum price
  price_max: 2000000,      // maximum price
  search: 'luxury',        // search term
  sort: 'newest',          // newest, oldest, price_low, price_high
  limit: 10                // number of results
});
```

### Get Property by ID
```javascript
const property = await apiService.properties.getById(propertyId);
```

### Get New Arrivals
```javascript
const newArrivals = await apiService.properties.getNewArrivals(6);
```

### Get Featured Properties
```javascript
const featured = await apiService.properties.getFeatured(6);
```

### Get Properties by Type
```javascript
const villas = await apiService.properties.getByType('villa', 10);
```

### Get Properties by Emirate
```javascript
const ajmanProperties = await apiService.properties.getByEmirate('ajman', 10);
```

### Search Properties
```javascript
const results = await apiService.properties.search('luxury villa');
```

### Create Property (Authenticated)
```javascript
const newProperty = await apiService.properties.create({
  title: 'Luxury Villa',
  description: 'Beautiful villa with garden',
  type: 'villa',
  purpose: 'sale',
  price: 1500000,
  area_sqft: 3000,
  bedrooms: 4,
  bathrooms: 3,
  emirate: 'ajman',
  location: 'Ajman Marina',
  images: ['image1.jpg', 'image2.jpg'],
  features: ['Garden', 'Pool', 'Parking']
});
```

### Update Property (Authenticated)
```javascript
const updated = await apiService.properties.update(propertyId, {
  price: 1600000,
  status: 'active'
});
```

### Delete Property (Authenticated)
```javascript
await apiService.properties.delete(propertyId);
```

### Get Properties by Owner
```javascript
const ownerProperties = await apiService.properties.getByOwner(ownerId);
```

## 📞 Leads API

### Get All Leads
```javascript
const leads = await apiService.leads.getAll({
  status: 'new',           // new, contacted, interested, closed
  property_id: 123         // filter by property
});
```

### Get Lead by ID
```javascript
const lead = await apiService.leads.getById(leadId);
```

### Create Lead
```javascript
const newLead = await apiService.leads.create({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+971501234567',
  message: 'Interested in this property',
  property_id: 123
});
```

### Update Lead
```javascript
const updated = await apiService.leads.update(leadId, {
  status: 'contacted',
  message: 'Customer contacted successfully'
});
```

### Update Lead Status
```javascript
const updated = await apiService.leads.updateStatus(leadId, 'interested');
```

### Delete Lead
```javascript
await apiService.leads.delete(leadId);
```

### Get Leads by Property
```javascript
const propertyLeads = await apiService.leads.getByProperty(propertyId);
```

## 👥 Users API

### Get All Users
```javascript
const users = await apiService.users.getAll();
```

### Get User by ID
```javascript
const user = await apiService.users.getById(userId);
```

### Update User
```javascript
const updated = await apiService.users.update(userId, {
  name: 'New Name',
  phone: '+971501234567'
});
```

### Delete User
```javascript
await apiService.users.delete(userId);
```

## 🔍 Health Check

### Check Backend Status
```javascript
const health = await apiService.health();
// Returns: { status: 'OK', message: '...', timestamp: '...', version: '1.0.0' }
```

## 🛠️ Utility Functions

### Check Backend Availability
```javascript
const isAvailable = await apiService.utils.isBackendAvailable();
```

### Get Base URL
```javascript
const baseURL = apiService.utils.getBaseURL();
```

### Set Auth Token
```javascript
apiService.utils.setAuthToken(token);
```

### Clear Auth Data
```javascript
apiService.utils.clearAuth();
```

## 🔧 System Status Utility

### Check System Status
```javascript
import systemStatus from '../utils/systemStatus';

// Log complete system status
const status = await systemStatus.logStatus();

// Check backend status only
const backendStatus = await systemStatus.checkBackendStatus();

// Test connectivity
const connectivity = await systemStatus.testConnectivity();

// Get system information
const systemInfo = systemStatus.getSystemInfo();
```

## 📊 Response Format

### Success Response
```javascript
{
  properties: [...],      // For properties endpoints
  property: {...},        // For single property
  leads: [...],           // For leads endpoints
  lead: {...},            // For single lead
  users: [...],           // For users endpoints
  user: {...},            // For single user
  message: "Success",     // Success message
  token: "...",           // For auth endpoints
  user: {...}             // For auth endpoints
}
```

### Error Response
```javascript
{
  error: "Error message",
  details: "Additional error details"
}
```

## 🚨 Error Handling

The API includes comprehensive error handling:

- **Network Errors**: Automatically detected and logged
- **Authentication Errors**: Automatic token cleanup and redirect
- **Timeout Errors**: 15-second timeout with proper error messages
- **Validation Errors**: Detailed error messages from backend

## 🔄 Request/Response Interceptors

### Request Interceptor
- Automatically adds JWT token to headers
- Logs request start time for performance monitoring
- Handles request configuration

### Response Interceptor
- Calculates and logs request duration
- Handles authentication errors (401)
- Manages network error detection
- Provides detailed error logging

## 📈 Performance Monitoring

The API automatically logs:
- Request duration
- Success/failure rates
- Network connectivity status
- Backend availability

## 🔒 Security Features

- JWT token authentication
- Automatic token refresh handling
- Secure header management
- CORS configuration
- Request timeout protection

## 📱 Usage Examples

### Complete Property Search
```javascript
const searchProperties = async (filters) => {
  try {
    const response = await apiService.properties.getAll(filters);
    return response.properties;
  } catch (error) {
    console.error('Search failed:', error.message);
    return [];
  }
};
```

### Create Lead with Error Handling
```javascript
const createLead = async (leadData) => {
  try {
    const response = await apiService.leads.create(leadData);
    return { success: true, lead: response.lead };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### System Health Check
```javascript
const checkSystemHealth = async () => {
  const status = await systemStatus.logStatus();
  
  if (status.backend.status === 'online') {
    console.log('✅ System is healthy');
  } else {
    console.log('❌ Backend is offline');
  }
  
  return status;
};
```

## 🎯 Best Practices

1. **Always handle errors** with try-catch blocks
2. **Use the utility functions** for common operations
3. **Check system status** before making requests
4. **Use appropriate filters** to reduce data transfer
5. **Implement loading states** for better UX
6. **Log API calls** for debugging purposes

## 🔄 Migration from Old API

If migrating from the old localStorage-based API:

1. Replace `api.properties.getAll()` calls
2. Update response handling (remove `.data` property)
3. Use new error handling patterns
4. Implement system status checking
5. Update authentication flow

## 📞 Support

For API support or questions:
- Check the browser console for detailed logs
- Use `systemStatus.logStatus()` for debugging
- Verify backend server is running on port 3005
- Ensure CORS is properly configured
