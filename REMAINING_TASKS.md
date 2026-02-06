# 📋 Remaining Tasks - Plant Growth & Harvesting Monitoring System

## ✅ COMPLETED (Current Status)

### Backend Infrastructure
- ✅ Express server setup
- ✅ Firebase Firestore connection
- ✅ User authentication routes (`/api/signup`, `/api/login`)
- ✅ JWT middleware for protected routes
- ✅ Plant CRUD API endpoints (`/api/plants`)
- ✅ Database health check endpoint

### Frontend - Authentication
- ✅ Login page with form validation
- ✅ Signup page with form validation
- ✅ Error & success message handling
- ✅ Loading states on auth pages
- ✅ Auto-redirect after successful registration/login

### Frontend - UI Components
- ✅ AuthLayout wrapper
- ✅ InputField component
- ✅ PrimaryButton component
- ✅ PlantScanner component (placeholder)
- ✅ Dashboard layout (UI only)

### Frontend - Services
- ✅ Plant API service layer (`plantAPI.js`)
- ✅ All CRUD functions ready (create, read, update, delete)

---

## ⏳ REMAINING CRITICAL TASKS (Priority Order)

### 🔴 TIER 1: BLOCKING ISSUES (Must Fix Now)

#### 1. **JWT Token Storage & Retrieval**
   - **What's Missing**: Token not saved to localStorage after login
   - **Impact**: Frontend cannot send authorized requests to protected endpoints
   - **Files to Modify**: 
     - `frontend/src/pages/Login.jsx` - Save token after successful login
     - `frontend/src/pages/Dashboard.jsx` - Retrieve and use token
   - **Task**:
     ```javascript
     // In Login.jsx handleLogin success:
     localStorage.setItem('authToken', responseData.token);
     
     // Token will be auto-used by plantAPI.js via getToken()
     ```

#### 2. **Protected Routes (Auth Guards)**
   - **What's Missing**: Dashboard accessible without login
   - **Impact**: Users can bypass authentication
   - **Files to Create/Modify**:
     - Create `frontend/src/components/ProtectedRoute.jsx`
     - Modify `frontend/src/App.jsx` to use protected routes
   - **Task**:
     ```javascript
     // Check if token exists before allowing access to /dashboard
     // Redirect to /login if no token
     ```

#### 3. **Backend Login Endpoint Issue**
   - **What's Missing**: Frontend expects `/api/login`, but backend has `/api/login`
   - **Current Issue**: Login might not be returning JWT token
   - **Files to Check/Fix**:
     - `backend/routes/authRoutes.js` - Currently returns `{ success: true }` only
     - Should return `{ success: true, token: JWT_TOKEN }`
   - **Task**: Update login endpoint to return token

---

### 🟠 TIER 2: PLANT MANAGEMENT (Core Feature)

#### 4. **Plant Management Dashboard UI**
   - **What's Missing**: No UI to create/view/edit/delete plants
   - **Files to Create**:
     - `frontend/src/components/PlantList.jsx` - Display all user plants
     - `frontend/src/components/CreatePlantForm.jsx` - Create new plant
     - `frontend/src/components/PlantCard.jsx` - Individual plant display
   - **Task**: Build UI components that call `plantAPI` functions

#### 5. **Connect PlantScanner to Backend**
   - **What's Missing**: AI health scanner is a placeholder
   - **Impact**: No real plant disease detection
   - **Files to Modify**:
     - `frontend/src/components/PlantScanner.jsx`
   - **Task**: 
     - Replace placeholder with real API call
     - Integrate with plant health detection service (Google Vision API or similar)

#### 6. **Real-time Sensor Data Integration**
   - **What's Missing**: Sensor readings are hardcoded
   - **Impact**: Dashboard shows fake data (24.8°C, 62%, 32%)
   - **Files to Modify**:
     - `frontend/src/pages/Dashboard.jsx`
   - **Task**:
     - Fetch real sensor data from backend
     - Update frontend to display actual values
     - Add WebSocket or polling for live updates

---

### 🟡 TIER 3: ADVANCED FEATURES

#### 7. **WebSocket Real-time Updates** (Optional but Recommended)
   - **What's Missing**: No live sensor data streaming
   - **Impact**: Dashboard data is static, not real-time
   - **Libraries Needed**: Socket.io, Socket.io-client
   - **Files to Create**:
     - `backend/websocket-server.js` - WebSocket setup
     - `frontend/src/hooks/useSensorData.js` - Real-time data hook
   - **Task**: Implement real-time sensor streaming

#### 8. **Plant Health Alerts & Notifications**
   - **What's Missing**: No system to alert user about plant issues
   - **Impact**: User might miss critical plant problems
   - **Task**:
     - Implement alert system based on thresholds
     - Show notifications when soil moisture too low, temperature too high, etc.

#### 9. **Data Visualization & Charts**
   - **What's Missing**: No graphs/charts for historical data
   - **Impact**: Can't track plant growth trends
   - **Libraries Needed**: Chart.js, Recharts, or similar
   - **Task**: Add chart components to show historical sensor data

#### 10. **Harvesting Recommendations Engine**
   - **What's Missing**: System to recommend when to harvest
   - **Impact**: Core proposal feature missing
   - **Task**:
     - Implement logic to track plant maturity
     - Suggest harvest timing based on species & growth stage

---

### 🔵 TIER 4: OPTIONAL ENHANCEMENTS

#### 11. **Mobile Responsiveness Fine-tuning**
   - **Current Status**: Basic responsive design exists
   - **Task**: Test on mobile devices, adjust spacing/fonts

#### 12. **Dark Mode Support**
   - **What's Missing**: Only light mode available
   - **Task**: Add theme toggle with dark mode CSS

#### 13. **Multi-plant Comparison View**
   - **What's Missing**: Can only see one plant at a time
   - **Task**: Add comparison feature to see metrics for multiple plants

#### 14. **Export Data (CSV/PDF)**
   - **What's Missing**: Can't export plant data
   - **Task**: Add data export functionality

#### 15. **User Profile/Settings Page**
   - **What's Missing**: No user settings or profile editing
   - **Task**: Create `/profile` page where users can change password, settings

---

## 📊 Quick Completion Map

| Task | Priority | Est. Time | Status |
|------|----------|-----------|--------|
| JWT token storage | 🔴 Critical | 30 min | NOT STARTED |
| Protected routes | 🔴 Critical | 30 min | NOT STARTED |
| Fix login to return token | 🔴 Critical | 15 min | NOT STARTED |
| Plant management UI | 🟠 High | 3 hours | NOT STARTED |
| Real sensor data | 🟠 High | 2 hours | NOT STARTED |
| PlantScanner API integration | 🟠 High | 2 hours | NOT STARTED |
| WebSocket real-time | 🟡 Medium | 3 hours | NOT STARTED |
| Alerts & notifications | 🟡 Medium | 2 hours | NOT STARTED |
| Data visualization | 🟡 Medium | 2 hours | NOT STARTED |
| Harvest engine | 🟡 Medium | 2 hours | NOT STARTED |
| Mobile polish | 🔵 Low | 1 hour | NOT STARTED |
| Dark mode | 🔵 Low | 1 hour | NOT STARTED |
| Data export | 🔵 Low | 1 hour | NOT STARTED |
| User profile page | 🔵 Low | 1 hour | NOT STARTED |

---

## 🎯 Recommended Next Steps

### Immediate (Next 15 minutes)
1. Save JWT token to localStorage on login
2. Update backend login endpoint to return token
3. Test login → token storage flow

### Short-term (Next 2 hours)
4. Create ProtectedRoute component
5. Build PlantList & PlantCard components
6. Create CreatePlantForm component
7. Connect plant management UI to API

### Medium-term (Next 4 hours)
8. Integrate real sensor data source
9. Add WebSocket for live updates
10. Implement plant health alerts

### Long-term (Future sprints)
11. Add data visualization charts
12. Build harvesting recommendation engine
13. Polish UI/UX and mobile experience

---

## 📝 Code Examples

### Example: JWT Token Storage (30 sec fix)
```javascript
// In Login.jsx handleLogin:
if (response.ok && responseData.success) {
  // ADD THIS LINE:
  localStorage.setItem('authToken', responseData.token);
  
  setSuccess(true);
  // ... rest of code
}
```

### Example: Protected Route Component
```javascript
// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
```

### Example: Using in App.jsx
```javascript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 🚀 Current Blockers

1. **JWT token not saved** - Can't make authenticated API requests
2. **No route protection** - Anyone can access dashboard
3. **No plant UI** - Can't manage plants even though API is ready
4. **Hardcoded sensor data** - Dashboard shows fake values

**Minimum viable product needs**: Tasks 1-3 + 4 = ~4 hours of work

