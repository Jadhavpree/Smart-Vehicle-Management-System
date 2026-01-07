import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, ThumbsUp, MessageSquare, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { SystemFlow } from "@/services/systemFlow";

const ReviewsRatings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const userRole = localStorage.getItem('userRole') || 'customer';
  const dashboardRoute = SystemFlow.getDefaultRoute(userRole);

  useEffect(() => {
    loadReviews();
    const interval = setInterval(loadReviews, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get('/reviews/all');
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const ratingStats = {
    average: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0',
    total: reviews.length,
    breakdown: [5, 4, 3, 2, 1].map(stars => {
      const count = reviews.filter(r => r.rating === stars).length;
      return {
        stars,
        count,
        percentage: reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
      };
    })
  };

  const handleSubmitReview = async () => {
    if (selectedRating === 0) {
      toast({
        title: "Please select a rating",
        description: "You need to select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    if (!reviewText.trim()) {
      toast({
        title: "Please write a review",
        description: "Please provide your feedback in the review text.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await api.post('/reviews', {
        rating: selectedRating,
        comment: reviewText.trim(),
        bookingId: 'general' // For general reviews without specific booking
      });

      if (response.success) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });
        setSelectedRating(0);
        setReviewText("");
        loadReviews(); // Refresh reviews
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: "Failed to submit review",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number, interactive = false, size = "h-5 w-5") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} cursor-${interactive ? "pointer" : "default"} transition-colors ${
              star <= (interactive ? (hoverRating || selectedRating) : rating)
                ? "fill-warning text-warning"
                : "text-muted-foreground"
            }`}
            onClick={() => interactive && setSelectedRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to={dashboardRoute} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-card-foreground">Reviews & Ratings</h1>
          <p className="text-muted-foreground mt-1">See what customers are saying about our services</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Overview */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Overall Rating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-foreground mb-2">{ratingStats.average}</div>
                  {renderStars(Math.round(ratingStats.average))}
                  <p className="text-muted-foreground mt-2">{ratingStats.total} reviews</p>
                </div>

                <div className="space-y-3">
                  {ratingStats.breakdown.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground w-8">{item.stars} ★</span>
                      <Progress value={item.percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground w-12 text-right">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Write Review */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>Share your experience with our service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Your Rating</label>
                  {renderStars(selectedRating, true, "h-8 w-8")}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Your Review</label>
                  <Textarea
                    placeholder="Tell us about your experience..."
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>

                <Button onClick={handleSubmitReview} className="w-full bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Customer Reviews ({reviews.length})</h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              </div>
            ) : reviews.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground">Be the first to leave a review!</p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review._id} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {review.customer?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{review.customer?.name || 'Anonymous'}</h3>
                          <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className="bg-primary/10 text-primary border-0">{review.serviceType}</Badge>
                      <Badge className="bg-muted text-muted-foreground border-0">
                        {review.vehicle?.year} {review.vehicle?.make} {review.vehicle?.model}
                      </Badge>
                      <Badge className="bg-accent/10 text-accent border-0">Service Center: {review.serviceCenter?.name}</Badge>
                    </div>

                    <p className="text-foreground mb-4">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsRatings;
