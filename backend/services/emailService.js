const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendEmail(to, subject, html, text = '') {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@rosechemicals.com',
        to,
        subject,
        html,
        text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Welcome email template
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Rose Chemicals!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e11d48;">Welcome to Rose Chemicals!</h1>
        <p>Dear ${user.name},</p>
        <p>Thank you for joining Rose Chemicals! We're excited to have you as part of our community.</p>
        <p>With your new account, you can:</p>
        <ul>
          <li>Browse our extensive catalog of cleaning products</li>
          <li>Enjoy faster checkout with saved addresses</li>
          <li>Track your order history</li>
          <li>Receive exclusive offers and updates</li>
        </ul>
        <p>Start shopping now and discover our premium cleaning solutions!</p>
        <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/products" 
           style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Shop Now
        </a>
        <p>Best regards,<br>The Rose Chemicals Team</p>
      </div>
    `;
    
    return this.sendEmail(user.email, subject, html);
  }

  // Order confirmation email template
  async sendOrderConfirmation(user, order) {
    const subject = `Order Confirmation - #${order.orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e11d48;">Order Confirmation</h1>
        <p>Dear ${user.name},</p>
        <p>Thank you for your order! We've received your order and it's being processed.</p>
        
        <h2>Order Details</h2>
        <p><strong>Order Number:</strong> #${order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        
        <h3>Items Ordered:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Product</th>
              <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.product.name}</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">₹${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h3>Shipping Address:</h3>
        <p>
          ${order.shippingAddress.name}<br>
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
          ${order.shippingAddress.phone}
        </p>
        
        <p>We'll send you another email with tracking information once your order ships.</p>
        <p>Thank you for choosing Rose Chemicals!</p>
        
        <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/orders/${order._id}" 
           style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Track Order
        </a>
        
        <p>Best regards,<br>The Rose Chemicals Team</p>
      </div>
    `;
    
    return this.sendEmail(user.email, subject, html);
  }

  // Order shipped email template
  async sendOrderShipped(user, order, trackingNumber) {
    const subject = `Your Order Has Shipped - #${order.orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e11d48;">Your Order Has Shipped!</h1>
        <p>Dear ${user.name},</p>
        <p>Great news! Your order #${order.orderNumber} has been shipped and is on its way to you.</p>
        
        <h2>Shipping Details</h2>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
        
        <p>You can track your package using the tracking number above.</p>
        
        <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/orders/${order._id}" 
           style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Track Order
        </a>
        
        <p>Thank you for your business!</p>
        <p>Best regards,<br>The Rose Chemicals Team</p>
      </div>
    `;
    
    return this.sendEmail(user.email, subject, html);
  }

  // Password reset email template
  async sendPasswordReset(user, resetToken) {
    const subject = 'Password Reset Request - Rose Chemicals';
    const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e11d48;">Password Reset Request</h1>
        <p>Dear ${user.name},</p>
        <p>We received a request to reset your password for your Rose Chemicals account.</p>
        <p>Click the button below to reset your password:</p>
        
        <a href="${resetUrl}" 
           style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
          Reset Password
        </a>
        
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        
        <p>Best regards,<br>The Rose Chemicals Team</p>
      </div>
    `;
    
    return this.sendEmail(user.email, subject, html);
  }
}

module.exports = new EmailService();
