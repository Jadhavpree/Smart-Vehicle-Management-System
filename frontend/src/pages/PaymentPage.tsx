import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { CreditCard, Lock, Loader2, CheckCircle } from "lucide-react";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !id) return;

      const response = await api.get(`/invoices/${id}`);
      if (response.success) {
        setInvoice(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load invoice",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        title: "Validation Error",
        description: "Please fill in all payment details",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.processPayment(token, id!, {
        paymentMethod,
        cardNumber: cardNumber.slice(-4),
        cardName
      });

      if (response.success) {
        toast({
          title: "Payment Successful",
          description: `Payment processed successfully! Redirecting...`
        });
        // Reload invoice data to get updated status
        await loadInvoice();
        setTimeout(() => navigate(`/invoice/${id}`), 1500);
      } else {
        toast({
          title: "Payment Failed",
          description: response.message || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment processing failed",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Invoice Not Found</h2>
          <Button onClick={() => navigate("/customer")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Payment</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Card Number</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
                  maxLength={16}
                />
              </div>

              <div>
                <Label>Cardholder Name</Label>
                <Input
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expiry Date</Label>
                  <Input
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input
                    type="password"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Lock className="h-4 w-4" />
                <span>Your payment information is secure</span>
              </div>

              <Button
                className="w-full bg-success hover:bg-success/90"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Pay ${invoice.totalAmount?.toFixed(2)}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Invoice Number</p>
                <p className="font-medium">{invoice.invoiceNumber}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">Service Details</p>
                <p className="font-medium">{invoice.serviceType}</p>
                <p className="text-sm text-muted-foreground">
                  {invoice.vehicle?.year} {invoice.vehicle?.make} {invoice.vehicle?.model}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Labor Cost</span>
                  <span className="font-medium">${invoice.laborCost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parts Cost</span>
                  <span className="font-medium">${invoice.partsCost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${invoice.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium">${invoice.tax?.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-secondary">${invoice.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
