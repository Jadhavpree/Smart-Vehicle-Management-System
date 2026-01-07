import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Wrench, FileText, CreditCard, Car } from "lucide-react";

interface StatusFlowProps {
  currentStatus: string;
  entityType: 'booking' | 'jobcard' | 'invoice';
}

const StatusFlow = ({ currentStatus, entityType }: StatusFlowProps) => {
  const getStatusFlow = () => {
    switch (entityType) {
      case 'booking':
        return [
          { key: 'pending', label: 'Pending', icon: Clock },
          { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
          { key: 'job_card_created', label: 'Job Card Created', icon: FileText },
          { key: 'in_service', label: 'In Service', icon: Wrench },
          { key: 'ready_for_billing', label: 'Ready for Billing', icon: CreditCard },
          { key: 'paid', label: 'Completed', icon: CheckCircle }
        ];
      case 'jobcard':
        return [
          { key: 'created', label: 'Created', icon: FileText },
          { key: 'in-progress', label: 'In Progress', icon: Wrench },
          { key: 'completed', label: 'Completed', icon: CheckCircle }
        ];
      case 'invoice':
        return [
          { key: 'pending', label: 'Pending Payment', icon: Clock },
          { key: 'paid', label: 'Paid', icon: CheckCircle },
          { key: 'failed', label: 'Payment Failed', icon: Clock }
        ];
      default:
        return [];
    }
  };

  const statusFlow = getStatusFlow();
  const currentIndex = statusFlow.findIndex(status => status.key === currentStatus);

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      {statusFlow.map((status, index) => {
        const Icon = status.icon;
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <div key={status.key} className="flex items-center space-x-2 min-w-fit">
            <div className="flex flex-col items-center space-y-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-success text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <Badge
                variant={isActive ? (isCurrent ? "default" : "secondary") : "outline"}
                className="text-xs whitespace-nowrap"
              >
                {status.label}
              </Badge>
            </div>
            {index < statusFlow.length - 1 && (
              <div
                className={`w-8 h-0.5 transition-colors ${
                  index < currentIndex ? "bg-success" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatusFlow;