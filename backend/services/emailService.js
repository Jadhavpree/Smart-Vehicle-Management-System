const nodemailer = require('nodemailer');

// Create transporter (using Gmail as example - can be configured for other providers)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

const sendInvoiceEmail = async (customerEmail, invoiceData) => {
  try {
    const transporter = createTransporter();
    
    const invoice = {
      id: invoiceData.invoiceNumber || `INV-${invoiceData._id?.toString().slice(-6)}`,
      date: new Date(invoiceData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      total: invoiceData.totalAmount || 0,
      customer: invoiceData.customer?.name || 'Valued Customer',
      serviceCenter: invoiceData.serviceCenter?.name || 'AutoServe Pro Service Center',
      vehicle: `${invoiceData.vehicle?.year || ''} ${invoiceData.vehicle?.make || ''} ${invoiceData.vehicle?.model || ''}`.trim()
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .invoice-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invoice from ${invoice.serviceCenter}</h1>
          </div>
          
          <div class="content">
            <h2>Dear ${invoice.customer},</h2>
            <p>Thank you for choosing our services. Please find your invoice details below:</p>
            
            <div class="invoice-details">
              <h3>Invoice Details</h3>
              <p><strong>Invoice Number:</strong> ${invoice.id}</p>
              <p><strong>Date:</strong> ${invoice.date}</p>
              <p><strong>Vehicle:</strong> ${invoice.vehicle}</p>
              <p><strong>Total Amount:</strong> $${invoice.total.toFixed(2)}</p>
            </div>
            
            <p>You can view the complete invoice details by clicking the button below:</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/invoice/${invoiceData._id}" class="button">View Invoice</a>
            
            <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email from ${invoice.serviceCenter}</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@autoservepro.com',
      to: customerEmail,
      subject: `Invoice ${invoice.id} from ${invoice.serviceCenter}`,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendInvoiceEmail
};