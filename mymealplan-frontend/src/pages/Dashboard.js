import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await fetch('http://localhost:8000/api/my-account/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          setError('Falha ao obter os dados da conta');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setAccountData(data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao buscar os dados da conta');
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Meal Swipes: {accountData.meal_swipes}</p>
      <p>Flex Dollars: {accountData.flex_dollars}</p>
      {/* Você pode renderizar outros dados conforme necessário */}
    </div>
  );
};

export default Dashboard;
