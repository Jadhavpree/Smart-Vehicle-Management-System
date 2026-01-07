import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InventoryTest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      const response = await fetch('http://localhost:5000/api/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const result = await response.json();
      console.log('Response data:', result);
      
      if (response.ok) {
        setData(result);
      } else {
        setError(result.message || 'API call failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAddItem = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const testItem = {
        partName: 'Test Oil',
        sku: 'TEST-001',
        category: 'lubricants',
        currentStock: 10,
        reorderLevel: 5,
        unitPrice: 25.99,
        supplier: 'Test Supplier'
      };
      
      const response = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testItem)
      });
      
      const result = await response.json();
      console.log('Add item response:', result);
      
      if (response.ok) {
        setData(result);
        testAPI(); // Refresh list
      } else {
        setError(result.message || 'Failed to add item');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Inventory API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testAPI} disabled={loading}>
              {loading ? 'Loading...' : 'Test Get Inventory'}
            </Button>
            <Button onClick={testAddItem} disabled={loading}>
              {loading ? 'Loading...' : 'Test Add Item'}
            </Button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {data && (
            <div className="p-4 bg-green-100 border border-green-400 rounded">
              <strong>Success:</strong>
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryTest;