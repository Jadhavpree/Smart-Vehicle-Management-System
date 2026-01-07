import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (invoiceData: any, invoice: any, laborItems: any[], partsItems: any[], subtotalLabor: number, subtotalParts: number, subtotal: number, tax: number, total: number) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.serviceCenter.name, 14, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.serviceCenter.address, 14, 27);
  doc.text(invoice.serviceCenter.phone, 14, 32);
  doc.text(invoice.serviceCenter.email, 14, 37);
  doc.text(`Tax ID: ${invoice.serviceCenter.taxId}`, 14, 42);
  
  // Invoice Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 200, 20, { align: 'right' });
  doc.setFontSize(12);
  doc.text(invoice.id, 200, 28, { align: 'right' });
  
  // Status Badge
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  if (invoice.status === 'Paid') {
    doc.setTextColor(34, 197, 94);
  } else {
    doc.setTextColor(234, 179, 8);
  }
  doc.text(invoice.status.toUpperCase(), 200, 35, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 48, 196, 48);
  
  // Customer Info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 14, 58);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(invoice.customer.name, 14, 64);
  doc.text(invoice.customer.address, 14, 69);
  doc.text(invoice.customer.phone, 14, 74);
  doc.text(invoice.customer.email, 14, 79);
  
  // Vehicle Info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Vehicle Information:', 110, 58);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${invoice.vehicle.year} ${invoice.vehicle.make} ${invoice.vehicle.model}`, 110, 64);
  doc.text(`License: ${invoice.vehicle.licensePlate}`, 110, 69);
  doc.text(`VIN: ${invoice.vehicle.vin}`, 110, 74);
  doc.text(`Mileage: ${invoice.vehicle.mileage}`, 110, 79);
  
  // Invoice Details
  doc.setFillColor(245, 245, 245);
  doc.rect(14, 85, 182, 18, 'F');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Invoice Date:', 18, 92);
  doc.text('Due Date:', 80, 92);
  doc.text('Job Card ID:', 142, 92);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.date, 18, 98);
  doc.text(invoice.dueDate, 80, 98);
  doc.text(invoice.jobCardId, 142, 98);
  
  // Labor Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Labor', 14, 113);
  
  autoTable(doc, {
    startY: 118,
    head: [['Description', 'Hours', 'Rate', 'Amount']],
    body: laborItems.map(item => [
      item.description,
      item.hours.toFixed(2),
      `$${item.rate.toFixed(2)}`,
      `$${item.amount.toFixed(2)}`
    ]),
    foot: [['', '', 'Labor Subtotal', `$${subtotalLabor.toFixed(2)}`]],
    theme: 'striped',
    headStyles: { fillColor: [100, 100, 100] },
    footStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' }
  });
  
  // Parts Table
  const laborTableEnd = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Parts & Materials', 14, laborTableEnd);
  
  autoTable(doc, {
    startY: laborTableEnd + 5,
    head: [['Description', 'Qty', 'Unit Price', 'Amount']],
    body: partsItems.map(item => [
      item.description,
      item.quantity.toString(),
      `$${item.unitPrice.toFixed(2)}`,
      `$${item.amount.toFixed(2)}`
    ]),
    foot: [['', '', 'Parts Subtotal', `$${subtotalParts.toFixed(2)}`]],
    theme: 'striped',
    headStyles: { fillColor: [100, 100, 100] },
    footStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' }
  });
  
  // Totals
  const partsTableEnd = (doc as any).lastAutoTable.finalY + 10;
  const totalsX = 140;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, partsTableEnd);
  doc.text(`$${subtotal.toFixed(2)}`, 196, partsTableEnd, { align: 'right' });
  
  doc.text('Tax (10%):', totalsX, partsTableEnd + 6);
  doc.text(`$${tax.toFixed(2)}`, 196, partsTableEnd + 6, { align: 'right' });
  
  doc.setDrawColor(200, 200, 200);
  doc.line(totalsX, partsTableEnd + 10, 196, partsTableEnd + 10);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount:', totalsX, partsTableEnd + 18);
  doc.setTextColor(59, 130, 246);
  doc.text(`$${total.toFixed(2)}`, 196, partsTableEnd + 18, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  
  // Payment Status
  const paymentY = partsTableEnd + 28;
  if (invoice.status === 'Paid') {
    doc.setFillColor(220, 252, 231);
    doc.setDrawColor(34, 197, 94);
  } else {
    doc.setFillColor(254, 249, 195);
    doc.setDrawColor(234, 179, 8);
  }
  doc.rect(14, paymentY, 182, 16, 'FD');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status:', 18, paymentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.status === 'Paid' ? `Paid via ${invoice.paymentMethod} on ${invoice.date}` : 'Payment Pending', 18, paymentY + 12);
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your business!', 105, 275, { align: 'center' });
  doc.text(`For questions, contact: ${invoice.serviceCenter.email}`, 105, 280, { align: 'center' });
  doc.setFontSize(8);
  doc.text('This is a computer-generated invoice and does not require a signature.', 105, 285, { align: 'center' });
  
  // Save PDF
  doc.save(`Invoice_${invoice.id}.pdf`);
};
