import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

interface MechanicStats {
  id: string;
  name: string;
  role: string;
  totalJobs: number;
  avgRating: number;
  onTimeRate: number;
  satisfaction: number;
  avgTime: number;
  efficiency: number;
}

interface OverallStats {
  totalJobs: number;
  avgRating: number;
  onTimeRate: number;
  satisfaction: number;
}

export default function MechanicPerformance() {
  const [overall, setOverall] = useState<OverallStats | null>(null);
  const [mechanics, setMechanics] = useState<MechanicStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPerformance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.getMechanicsPerformance(token);
      if (response.success) {
        setOverall(response.data.overall);
        setMechanics(response.data.individuals);
      }
    } catch (error) {
      console.error('Failed to fetch performance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
    const interval = setInterval(fetchPerformance, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Mechanic Performance</h2>
        <p className="text-gray-600">Track and analyze team performance metrics</p>
      </div>

      {overall && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{overall.totalJobs}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{overall.avgRating}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{overall.onTimeRate}%</div>
              <div className="text-sm text-gray-600">On-Time Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{overall.satisfaction}%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4">Individual Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mechanics.map((mechanic) => (
            <Card key={mechanic.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {mechanic.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-base">{mechanic.name}</CardTitle>
                    <p className="text-sm text-gray-500">{mechanic.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <span className="font-semibold">{mechanic.avgRating} ({mechanic.totalJobs} jobs)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Satisfaction:</span>
                    <span className="font-semibold">{mechanic.satisfaction}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed:</span>
                    <span className="font-semibold">{mechanic.totalJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Time:</span>
                    <span className="font-semibold">{mechanic.avgTime} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Efficiency:</span>
                    <span className="font-semibold">{mechanic.efficiency}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
