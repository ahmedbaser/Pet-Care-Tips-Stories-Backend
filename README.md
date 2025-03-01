                                                  Pet Care Tips & Stories
                                           

Welcome to the  Pet Care Tips & Stories Backend.Pet Care Tips & Stories is a social media platform designed for pet lovers to share tips, stories, and experiences about pet care. The platform includes user authentication, post management, premium content, payment integration, and admin functionalities, Built using Node.js,Express,MongoDB, and Stripe for payment processing, this application provides a seamless experience for pet enthusiasts to connect and share valuable insights

## Features
 # User Management
 🔲 User Registration and Login: Users can register and log in using email and password. JWT tokens are used for     authentication
 🔲 Profile Management: Users can update their profile information(name, email, phone, address, etc).
 🔲 Follow/Unfollow Users: Users can follow or unfollow other users to stay updated with their posts.
 🔲 Password Reset: Users can reset their password via email using a secure token.

 # Post Management

 🔲 Create, Read, Update,Delete Posts: Users can create posts, view posts by other users, update their own posts, and delete posts.
 🔲 Upvote/Downvote Posts: Users can create posts, view posts by other users, update their own posts, and delete posts.
 🔲 Publish/Unpublish Posts(Admin Only): Admins can toggle the publish status of posts.
 🔲 Comments and Replies: Users can comment on posts and reply to comments to engage in discussion.

 # Premium Content

 🔲 Premium Content Creation(Admin Only):Admins can create premium content that is accessible only to premium users.
 🔲 Access Control: Non-premium users cannot access premium content.

 # Payment integration
  
 🔲 Stripe Payment Processing: Users can make payment to access premium content.
 🔲 Payment History: Admins can view payment history with filters (user ID, status, data range).

 # Admin Functionality

 🔲 Users Management: Admins can view, delete, and manage users.
 🔲 Post Management: Admins can view, delete, and manage posts.
 🔲 Category Management: Admins can create, update, and delete categories for posts.

 # Additional Features
 
 🔲 Image Upload: Users can upload images for posts.
 🔲 PDF Generation: Admins  can generate PDFs for nutrition plans (example features)
 🔲 Discoverable Users: Users can discover other users who are not in their following list.

## Technology used
  
  🔲 Backend: Node.js, Express
  🔲 Database: MongoDB
  🔲 Authentication: JSON Web Token(JWT)
  🔲 Payment Process: Stripe
  🔲 File Upload: Multer
  🔲 PDF Generation: PDFKit
  🔲 Validation: Express Validator

## Installation

 1. Clone the repository
     - git clone https://github.com/yourusername/your-repo-name.git
     - cd your-repo-name
 2. Install dependencies:
     - npm Install
         
 3. Set up environment variable:
    Create a .env file in the root directory and add the following variables:
     - JWT_SECRET= here will be the secret key
     - STRIPE_SECRET_KEY= here your_stripe_secret_key
     - MONGODB_URI= here your_mongodb_connection_string


 4. Run the application:
      npm run start:dev 

## API Endpoints

 # Authentication

  🔲 POST /api/auth/register - Register a new user.
  🔲 POST /api/auth/login - Log in a user.
  🔲 POST /api/auth/forgot-password - Request a password reset token.
  🔲 POST /api/auth/reset-password/:token - Reset password using the token.
 
 # User Management
    
  🔲 GET /api/users - Get all users (Admin only).
  🔲 DELETE /api/users/:id - Delete a user (Admin only).
  🔲 PUT /api/users/profile - Update user profile
  🔲 GET /api/users/profile - Get users profile

 # Post Management

  🔲 POST /api/posts - create a new post.
  🔲 GET /api/posts - Get all posts.
  🔲 GET /api/posts/:id - Get a single post ID.
  🔲 PUT /api/posts/:id - Update a post.
  🔲 DELETE /api/posts/:id - Delete a post.
  🔲 POST /api/posts/:id/upvote - Upvote a post.
  🔲 POST /api/posts/:id/downvote - Downvote a post

# Premium Content
  
  🔲 POST /api/premium-content - Create premium content (Admin only).
  🔲 GET /api/premium-content - Get all premium content.
  🔲 GET /api/premium-content/:id - Get a single premium content(restricted for non-premium users).
  🔲 DELETE /api/premium-content/:id - Delete premium content (Admin Only).
 
# Payment

  🔲 POST /api/payment/create-payment-intent - Create a payment intent for premium content.
  🔲 GET /api/payment/check-status/:paymentIntentId - Check payment status.


# Admin

  🔲 GET /api/admin/users - Get all users (Admin only).
  🔲 GET /api/admin/posts - Get all post (Admin only).
  🔲 PUT /api/admin/posts/:id/publish - Toggle post publish status (Admin only).
  🔲 GET /api/admin/payments- Get payment history (Admin only).






























