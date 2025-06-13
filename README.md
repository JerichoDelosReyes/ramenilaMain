# 🍜 Ramenila

Welcome to the Ramenila Admin Dashboard! This project is a comprehensive admin panel designed to manage a ramen restaurant's inventory, sales, and overall operations efficiently.

## ✨ Features

### 👥 Client Side Features
*   🍜 **Menu Display**: Browse our complete range of authentic Japanese dishes:
    * Variety of ramen including Hakodate, Kitakata, Spicy, Shoyu, Tokushima, and more
    * Side dishes like Gyoza, Karaage, Edamame, and Takoyaki
    * Selection of drinks including Hot Green Tea, Iced Lemon Tea, and Japanese Beer
    * Desserts featuring Mochi Ice Cream and Dorayaki
*   🛒 **Order System**: Easy-to-use ordering system with cart functionality
*   📱 **Responsive Design**: Fully responsive layout for all device sizes
*   🏠 **Landing Page**: Beautiful landing page with restaurant information and locations

### 💼 Admin Side Features
*   📊 **Interactive Dashboard**: 
    * Real-time view of daily sales and order metrics
    * Quick access to low stock alerts
    * Overview of recent orders and their status
*   📦 **Inventory Management**:
    * Add, edit, and delete menu items
    * Synchronized menu items with client-side display
    * Dynamic product images for all categories (🍜 Ramen, 🥟 Sides, 🥤 Drinks, 🍡 Desserts)
    * Low stock alerts with customizable minimum stock levels
*   💳 **Transaction Management**: 
    * Process incoming orders efficiently
    * Real-time order status updates
    * Comprehensive order tracking system
*   📜 **Transaction History**: 
    * Detailed view of all past orders
    * Order status tracking and updates
    * Search and filter functionality
*   ⚙️ **Settings**: System configuration and preferences management
*   🔔 **Notification System**: User-friendlynotifications for actions like adding, updating, or deleting products, positioned at the top-center of the screen.
*   ↔️ **Collapsible Sidebar**: A responsive sidebar for easy navigation.
*   📅 **Real-time Date & Time**: Display of the current date and time on the dashboard.

## 🚀 Live Preview

Check out the live preview of the Ramenila website here:
[https://jerichodelosreyes.github.io/ramenilaMain/](https://jerichodelosreyes.github.io/ramenilaMain/)

*(Note: The live preview includes both the client-facing menu and admin dashboard)*

## 🛠️ Technologies Used

*   🌐 **HTML5**: For the structure of the web pages.
*   🎨 **CSS3**: For styling and layout, ensuring a modern and responsive design.
*   ⚙️ **JavaScript (Vanilla)**: For client-side interactivity, DOM manipulation, and dynamic content.
*   🗄️ **Supabase**: Cloud-based PostgreSQL database with real-time features and REST API.
*   📊 **PostgreSQL**: Relational database for robust data management and complex queries.
*   🔄 **REST API**: RESTful API integration for seamless data operations.
*   <img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/favicon.ico" width="16" height="16"> **Font Awesome**: For icons used throughout the application.

## 📝 Database & Architecture

### 🏗️ **Database Schema**
*   **PostgreSQL on Supabase**: Cloud-hosted relational database
*   **Real-time Features**: Live updates across all connected clients
*   **Row Level Security (RLS)**: Secure data access with policies
*   **RESTful API**: Auto-generated API endpoints for all database operations

### 📊 **Database Tables**:
*   `categories` - Product categories (Ramen, Sides, Drinks, Desserts)
*   `products` - Complete product catalog with inventory tracking
*   `transactions` - Sales records with detailed order information
*   `users` - Admin system users with role-based permissions
*   `settings` - System configuration and preferences
*   `product_images` - Product image management and storage

### 🔄 **Real-time Synchronization**:
*   Live inventory updates across all admin terminals
*   Real-time transaction processing and history
*   Instant dashboard metrics and analytics
*   Synchronized settings across all users

## 📝 Future Enhancements (Completed ✅ / Planned 📋)

*   🔐 **Enhanced Security**: ✅
    * ✅ User authentication and role-based access control
    * ✅ Secure admin login system  
    * ✅ Data encryption for sensitive information
*   📊 **Advanced Analytics**: ✅
    * ✅ Detailed sales reports and trends
    * ✅ Real-time dashboard metrics
    * ✅ Inventory optimization with low stock alerts
*   💾 **Backend Integration**: ✅
    * ✅ Real-time data synchronization
    * ✅ Cloud-based data storage (Supabase)
    * ✅ Automated backup system
*   🎨 **UI Enhancements**: 📋
    * 📋 Dark mode theme
    * 📋 Customizable dashboard layouts
    * ✅ Enhanced mobile experience
*   🤖 **Automation Features**: 📋
    * 📋 Automated inventory reordering
    * 📋 Smart stock predictions
    * 📋 Scheduled reports generation

---

Thank you for checking out Ramenila!
