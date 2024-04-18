import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import './App.css';

import data from './inventory.json'; // Importa il file JSON

function App() {
  const [inventory, setInventory] = useState([]);
  const [quantities, setQuantities] = useState({}); // Definisci l'oggetto quantities

  useEffect(() => {
    // Funzione per calcolare il costo medio di ogni prodotto
    const calculateAverageCost = () => {
      const products = {}; // Oggetto per tenere traccia della somma dei costi per ogni prodotto
      const quantities = {}; // Oggetto per tenere traccia della somma delle quantità per ogni prodotto

      // Cicla su ogni ordine
      data.orders.forEach(order => {
        // Cicla su ogni prodotto nell'ordine
        order.products.forEach(product => {
          // Dividi il nome del prodotto dalla quantità, se presente
          const [productName, quantityMatch] = product.split(' x');
          const quantity = quantityMatch ? parseInt(quantityMatch) : 1;
          console.log(productName, quantity)
          // Aggiorna la somma delle quantità
          quantities[productName] = (quantities[productName] || 0) + quantity;

          // Calcola il costo finale dell'ordine
          const orderTotal = order.order_cost + order.shipping_cost + order.insurance_cost;

          // Calcola il costo target dell'ordine
          const targetPrice = data.target_prices[productName];
          const orderTargetCost = targetPrice * quantity;

          // Calcola il coefficiente per questo ordine
          const coefficient = orderTotal / orderTargetCost;

          // Calcola il costo effettivo del prodotto per questo ordine
          const actualPrice = targetPrice * coefficient;

          // Aggiorna la somma dei costi per questo prodotto
          products[productName] = (products[productName] || 0) + actualPrice;
        });
      });

      // Calcola il costo medio per ogni prodotto
      const averageCosts = {};
      Object.keys(products).forEach(product => {
        averageCosts[product] = products[product] / quantities[product];
      });

      return [averageCosts, quantities];
    };

    // Calcola il costo medio di ogni prodotto e aggiorna lo stato
    const avg = calculateAverageCost()
    setInventory(avg[0]);
    console.log(avg[1])
    setQuantities(avg[1]); // Aggiorna lo stato delle quantità
  }, []);

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
