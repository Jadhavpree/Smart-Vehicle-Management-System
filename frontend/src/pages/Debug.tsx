import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Debug = () => {
  const [storageData, setStorageData] = useState<any>({});

  const checkStorage = () => {
    const data = {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      userName: localStorage.getItem('userName'),
      userRole: localStorage.getItem('userRole'),
      allKeys: Object.keys(localStorage)
    };
    setStorageData(data);
    console.log('LocalStorage data:', data);
  };

  useEffect(() => {
    checkStorage();
  }, []);

  const clearStorage = () => {
    localStorage.clear();
    checkStorage();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={checkStorage}>Refresh</Button>
            <Button onClick={clearStorage} variant="destructive">Clear Storage</Button>
          </div>
          
          <div className="bg-muted p-4 rounded">
            <h3 className="font-semibold mb-2">LocalStorage Contents:</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(storageData, null, 2)}
            </pre>
          </div>

          <div className="bg-muted p-4 rounded">
            <h3 className="font-semibold mb-2">Current URL:</h3>
            <p className="text-sm">{window.location.href}</p>
          </div>

          <div className="bg-muted p-4 rounded">
            <h3 className="font-semibold mb-2">Test API Call:</h3>
            <Button onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/vehicles', {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                const data = await response.json();
                console.log('API Test Result:', data);
                alert('Check console for API result');
              } catch (error) {
                console.error('API Test Error:', error);
                alert('API test failed - check console');
              }
            }}>
              Test Vehicles API
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Debug;