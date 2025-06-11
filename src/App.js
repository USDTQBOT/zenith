import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AdminTools from './pages/AdminTools';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import RegisterUser from './pages/RegisterUser';
import Transactions from './pages/Transactions';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load sample data on initial render
  useEffect(() => {
    // Sample users
    const sampleUsers = [
      {
        id: '1',
        name: 'Poco',
        email: 'poco@admin.com',
        role: 'Super Admin',
        balance: 10000,
        joinDate: '2023-01-01',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      {
        id: '2',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Customer',
        balance: 1500,
        joinDate: '2023-02-15',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=2'
      }
    ];

    // Sample transactions
    const sampleTransactions = [
      {
        id: 't1',
        fromUserId: '1',
        toUserId: '2',
        amount: 500,
        date: '2023-06-10',
        description: 'Initial transfer',
        status: 'completed'
      }
    ];

    setUsers(sampleUsers);
    setTransactions(sampleTransactions);
    setNotifications([
      { id: 'n1', message: 'New user registered', date: '2023-06-15', read: false },
      { id: 'n2', message: 'System update available', date: '2023-06-14', read: false }
    ]);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const addUser = (newUser) => {
    setUsers([...users, newUser]);
    addNotification(`New user registered: ${newUser.name}`);
  };

  const addTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
    addNotification(`New transaction completed: $${newTransaction.amount}`);
    
    // Update user balances
    setUsers(users.map(user => {
      if (user.id === newTransaction.fromUserId) {
        return { ...user, balance: user.balance - newTransaction.amount };
      }
      if (user.id === newTransaction.toUserId) {
        return { ...user, balance: user.balance + newTransaction.amount };
      }
      return user;
    }));
  };

  const addNotification = (message) => {
    const newNotification = {
      id: `n${notifications.length + 1}`,
      message,
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className={`content ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <Navbar 
            toggleSidebar={toggleSidebar} 
            notifications={notifications}
            markNotificationAsRead={markNotificationAsRead}
          />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard users={users} transactions={transactions} />} />
              <Route path="/users" element={<Users users={users} />} />
              <Route path="/users/:id" element={<UserDetail users={users} transactions={transactions} />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin-tools" element={<AdminTools />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications notifications={notifications} />} />
              <Route path="/register-user" element={<RegisterUser addUser={addUser} />} />
              <Route path="/transactions" element={<Transactions users={users} addTransaction={addTransaction} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;