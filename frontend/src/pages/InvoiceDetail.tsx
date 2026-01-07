import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Mail,
  Calendar,
  Car,
  User,
  CreditCard,
  FileText,
  Loader2
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { generateInvoicePDF } from "@/lib/pdfGenerator";

const InvoiceDetail = () => {
  const { toast } = useToast();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    loadInvoiceData();
  }, [id]);

  const loadInvoiceData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !id) return;

      const response = await api.get(`/invoices/${id}`);
      if (response.success) {
        setInvoiceData(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load invoice data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Invoice Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested invoice could not be found.</p>
          <Link to="/service-center">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const invoice = {
    id: invoiceData.invoiceNumber || `INV-${invoiceData._id?.slice(-6)}`,
    jobCardId: invoiceData.jobCard?.jobCardNumber || `JC-${invoiceData.jobCard?._id?.slice(-6)}`,
    date: new Date(invoiceData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    dueDate: new Date(new Date(invoiceData.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    status: invoiceData.status === 'paid' ? 'Paid' : 'Pending',
    paymentMethod: invoiceData.paymentMethod || "Credit Card",
    customer: {
      name: invoiceData.customer?.name || "N/A",
      email: invoiceData.customer?.email || "N/A",
      phone: invoiceData.customer?.phone || "N/A",
      address: invoiceData.customer?.address || "N/A"
    },
    vehicle: {
      make: invoiceData.vehicle?.make || "N/A",
      model: invoiceData.vehicle?.model || "N/A",
      year: invoiceData.vehicle?.year || "N/A",
      vin: invoiceData.vehicle?.vin || "N/A",
      licensePlate: invoiceData.vehicle?.licensePlate || "N/A",
      mileage: invoiceData.vehicle?.mileage ? `${invoiceData.vehicle.mileage.toLocaleString()} km` : "N/A"
    },
    serviceCenter: {
      name: invoiceData.serviceCenter?.name || "AutoServe Pro Service Center",
      address: invoiceData.serviceCenter?.address || "456 Service Road, Cityville, ST 12345",
      phone: invoiceData.serviceCenter?.phone || "+1 (555) 987-6543",
      email: invoiceData.serviceCenter?.email || "contact@autoservepro.com",
      taxId: "TAX-123-456-789"
    }
  };

  const laborItems = invoiceData.jobCard?.laborTasks?.length > 0 
    ? invoiceData.jobCard.laborTasks.map((task: any) => ({
        description: task.task || "Service Work",
        hours: task.hours || 0,
        rate: task.hourlyRate || 50,
        amount: (task.hours || 0) * (task.hourlyRate || 50)
      }))
    : [{ description: invoiceData.serviceType || "Service Work", hours: 2.5, rate: 60, amount: invoiceData.laborCost || 150 }];

  const partsItems = invoiceData.jobCard?.spareParts?.length > 0
    ? invoiceData.jobCard.spareParts.map((part: any) => ({
        description: part.partName || "Parts and Materials",
        quantity: part.quantity || 1,
        unitPrice: part.unitPrice || 0,
        amount: part.totalPrice || (part.quantity * part.unitPrice)
      }))
    : [{ description: "Parts and Materials", quantity: 1, unitPrice: invoiceData.partsCost || 75, amount: invoiceData.partsCost || 75 }];

  const subtotalLabor = invoiceData.laborCost || 150;
  const subtotalParts = invoiceData.partsCost || 75;
  const subtotal = invoiceData.subtotal || (subtotalLabor + subtotalParts);
  const tax = invoiceData.tax || (subtotal * 0.1);
  const total = invoiceData.totalAmount || (subtotal + tax);

  const downloadPDF = () => {
    try {
      generateInvoicePDF(invoiceData, invoice, laborItems, partsItems, subtotalLabor, subtotalParts, subtotal, tax, total);
      toast({
        title: "Success",
        description: "Invoice PDF downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const sendEmail = () => {
    toast({
      title: "Email Sent",
      description: "Invoice has been sent to customer's email.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                to={userRole === 'customer' ? '/customer' : userRole === 'admin' ? '/admin' : '/service-center'} 
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-card-foreground">Invoice {invoice.id}</h1>
                <Badge className={
                  invoice.status === "Paid" 
                    ? "bg-success text-white" 
                    : invoice.status === "Pending"
                    ? "bg-warning text-white"
                    : "bg-destructive text-white"
                }>
                  {invoice.status}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border" onClick={sendEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" size="sm" className="border-border">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={downloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-border shadow-lg">
          <CardContent className="p-8 sm:p-12">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{invoice.serviceCenter.name}</h2>
                <p className="text-sm text-muted-foreground">{invoice.serviceCenter.address}</p>
                <p className="text-sm text-muted-foreground">{invoice.serviceCenter.phone}</p>
                <p className="text-sm text-muted-foreground">{invoice.serviceCenter.email}</p>
                <p className="text-sm text-muted-foreground mt-1">Tax ID: {invoice.serviceCenter.taxId}</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 p-3 bg-primary/10 rounded-lg mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">INVOICE</h3>
                <p className="text-lg text-muted-foreground mt-1">{invoice.id}</p>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Customer & Vehicle Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Bill To</h3>
                </div>
                <p className="font-medium text-foreground">{invoice.customer.name}</p>
                <p className="text-sm text-muted-foreground">{invoice.customer.address}</p>
                <p className="text-sm text-muted-foreground">{invoice.customer.phone}</p>
                <p className="text-sm text-muted-foreground">{invoice.customer.email}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Car className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Vehicle Information</h3>
                </div>
                <p className="font-medium text-foreground">
                  {invoice.vehicle.year} {invoice.vehicle.make} {invoice.vehicle.model}
                </p>
                <p className="text-sm text-muted-foreground">License Plate: {invoice.vehicle.licensePlate}</p>
                <p className="text-sm text-muted-foreground">VIN: {invoice.vehicle.vin}</p>
                <p className="text-sm text-muted-foreground">Mileage: {invoice.vehicle.mileage}</p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-muted/30 rounded-lg">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Invoice Date</p>
                </div>
                <p className="font-medium text-foreground">{invoice.date}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Due Date</p>
                </div>
                <p className="font-medium text-foreground">{invoice.dueDate}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Job Card ID</p>
                </div>
                <p className="font-medium text-foreground">{invoice.jobCardId}</p>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Labor Items */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4">Labor</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-foreground">Description</th>
                      <th className="text-right p-3 font-semibold text-foreground">Hours</th>
                      <th className="text-right p-3 font-semibold text-foreground">Rate</th>
                      <th className="text-right p-3 font-semibold text-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {laborItems.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/20">
                        <td className="p-3 text-foreground">{item.description}</td>
                        <td className="p-3 text-right text-foreground">{item.hours.toFixed(2)}</td>
                        <td className="p-3 text-right text-foreground">${item.rate.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium text-foreground">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-semibold">
                      <td colSpan={3} className="p-3 text-right text-foreground">Labor Subtotal</td>
                      <td className="p-3 text-right text-foreground">${subtotalLabor.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Parts Items */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4">Parts & Materials</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-foreground">Description</th>
                      <th className="text-right p-3 font-semibold text-foreground">Qty</th>
                      <th className="text-right p-3 font-semibold text-foreground">Unit Price</th>
                      <th className="text-right p-3 font-semibold text-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {partsItems.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/20">
                        <td className="p-3 text-foreground">{item.description}</td>
                        <td className="p-3 text-right text-foreground">{item.quantity}</td>
                        <td className="p-3 text-right text-foreground">${item.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium text-foreground">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-semibold">
                      <td colSpan={3} className="p-3 text-right text-foreground">Parts Subtotal</td>
                      <td className="p-3 text-right text-foreground">${subtotalParts.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full md:w-96 space-y-3">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-3 bg-secondary/10 px-4 rounded-lg">
                  <span className="text-xl font-bold text-foreground">Total Amount</span>
                  <span className="text-3xl font-bold text-secondary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {invoice.status === "Paid" ? (
              <div className="mt-8 p-4 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-success" />
                  <span className="font-semibold text-foreground">Payment Information</span>
                </div>
                <p className="text-sm text-foreground">
                  <span className="text-muted-foreground">Method:</span> {invoice.paymentMethod}
                </p>
                <p className="text-sm text-foreground">
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <Badge className="bg-success text-white">{invoice.status}</Badge>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Paid on {invoice.date}. Transaction ID: TXN-2024-ABC123
                </p>
              </div>
            ) : userRole === 'customer' ? (
              <div className="mt-8 p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-5 w-5 text-warning" />
                      <span className="font-semibold text-foreground">Payment Pending</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This invoice has not been paid yet. Click below to process payment.
                    </p>
                  </div>
                </div>
                <Link to={`/payment/${invoiceData._id}`}>
                  <Button className="w-full bg-success hover:bg-success/90 text-white">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now - ${total.toFixed(2)}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-8 p-4 bg-muted/30 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold text-foreground">Payment Status</span>
                </div>
                <p className="text-sm text-foreground">
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <Badge className="bg-warning/10 text-warning border-0">Pending Payment</Badge>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Waiting for customer to complete payment.
                </p>
              </div>
            )}

            {/* Footer Notes */}
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Thank you for your business! For questions about this invoice, please contact us at {invoice.serviceCenter.email}
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">
                This is a computer-generated invoice and does not require a signature.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceDetail;
