import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ReviewPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !bookingId) return;

      const response = await api.getBookings(token);
      if (response.success) {
        const foundBooking = response.data.find((b: any) => b._id === bookingId);
        setBooking(foundBooking);
      }
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive"
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please provide your feedback",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Please login to submit review",
          variant: "destructive"
        });
        return;
      }

      console.log('Submitting review:', { bookingId, rating, comment });

      const response = await api.post('/reviews', {
        bookingId,
        rating,
        comment
      });

      console.log('Review response:', response);

      if (response.success) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!"
        });
        navigate('/customer');
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to submit review",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Review submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/customer" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-card-foreground">Rate Your Service</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>How was your experience?</CardTitle>
            {booking && (
              <p className="text-sm text-muted-foreground">
                {booking.serviceType} - {booking.vehicle?.year} {booking.vehicle?.make} {booking.vehicle?.model}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= (hover || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Feedback</label>
              <Textarea
                placeholder="Tell us about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90">
              Submit Review
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewPage;
