import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import './App.css';

function App() {
  const [inventory, setInventory] = useState({});
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Effettua una richiesta HTTP per recuperare il file JSON dal repository su GitHub
        const response = await fetch('https://raw.githack.com/iFralex/flipping-inventory/main/inventory.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        // Calcola il costo medio di ogni prodotto e aggiorna lo stato
        const avg = calculateAverageCost(data);
        setInventory(avg[0]);
        setQuantities(avg[1]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateAverageCost = (data) => {
    const products = {};
    const quantities = {};

    data.orders.forEach(order => {
      order.products.forEach(product => {
        const [productName, quantityMatch] = product.split(' x');
        const quantity = quantityMatch ? parseInt(quantityMatch) : 1;

        quantities[productName] = (quantities[productName] || 0) + quantity;

        const orderTotal = order.order_cost + order.shipping_cost + order.insurance_cost;
        const targetPrice = data.target_prices[productName];
        const orderTargetCost = targetPrice * quantity;
        const coefficient = orderTotal / orderTargetCost;
        const actualPrice = targetPrice * coefficient;

        products[productName] = (products[productName] || 0) + actualPrice;
      });
    });

    const averageCosts = {};
    Object.keys(products).forEach(product => {
      averageCosts[product] = products[product] / quantities[product];
    });

    return [averageCosts, quantities];
  };

  return (
    <div className="App">
      <Typography variant="h4" gutterBottom>
        Inventario
      </Typography>
      <TableContainer component={Box}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prodotto</TableCell>
              <TableCell align="right">Quantità</TableCell>
              <TableCell align="right">Prezzo Medio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(inventory).map(product => (
              <TableRow key={product}>
                <TableCell component="th" scope="row">{product}</TableCell>
                <TableCell align="right">{quantities[product]}</TableCell>
                <TableCell align="right">${inventory[product].toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
