import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import './App.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


function App() {
  const [inventory, setInventory] = useState({});
  const [averages, setAverages] = useState({});
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Effettua una richiesta HTTP per recuperare il file JSON dal repository su GitHub
        const response = await fetch('https://raw.githack.com/iFralex/flipping-inventory/main/inventory.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json()

        const results = calculateAverageCost(data)
        // Calcola il costo medio di ogni prodotto e aggiorna lo stato
        console.log(data.orders)
        setInventory(data)
        setAverages(results.avg);
        setQuantities(results.quantities);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateAverageCost = (data) => {
    const quantities = {};
    const productsPrices = {}

    data.orders.forEach(order => {
      const orderTotal = order.order_cost + order.shipping_cost + order.insurance_cost;
      let targetOrderCost = 0
      order.products.forEach(product => {
        const [productName, quantityMatch] = product.split(' x');
        const quantity = quantityMatch ? parseInt(quantityMatch) : 1;

        quantities[productName] = (quantities[productName] || 0) + quantity;
        targetOrderCost += data.target_prices[productName] * quantity
      });
      let coefficient = orderTotal / targetOrderCost
      order.products.forEach(product => {
        const [productName, quantityMatch] = product.split(' x');
        productsPrices[productName] = (productsPrices[productName] || 0) + data.target_prices[productName] * (quantityMatch ? parseInt(quantityMatch) : 1) * coefficient
      })
    });

    const averageCosts = {};
    Object.keys(productsPrices).forEach(product => {
      averageCosts[product] = productsPrices[product] / quantities[product];
    });

    return { avg: averageCosts, quantities: quantities };
  };

  return (
    <div className="App">
      {inventory.orders && <div>
        <OverviewTable averages={averages} quantities={quantities} />
        <Typography variant="h4" gutterBottom>
          Ordini
        </Typography>
        {inventory.orders.map((order, i) => (
          <OrderTable key={i} order={order} />
        ))}</div>}
    </div>
  );
}

const OverviewTable = ({ averages, quantities }) => {
  return <div>
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
          {Object.keys(averages).map(product => (
            <TableRow key={product}>
              <TableCell component="th" scope="row">{product}</TableCell>
              <TableCell align="right">{quantities[product]}</TableCell>
              <TableCell align="right">€ {averages[product].toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
}

const OrderTable = ({ order }) => {
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    let quants = {}
    const orderTotal = order.order_cost + order.shipping_cost + order.insurance_cost;
    order.products.forEach(product => {
      const [productName, quantityMatch] = product.split(' x');
      const quantity = quantityMatch ? parseInt(quantityMatch) : 1;
      quants[productName] = (quants[productName] || 0) + quantity;
    });
    setQuantities(quants)
  }, [order])

  return <div>
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls={order.date + "-" + order.platform + "-content"}
        id={order.date + "-" + order.platform + "-head"}
      >
        <Typography variant="h5" gutterBottom style={{width: "100%"}}>
        <span style={{ float: 'left' }}>{order.date + " | " + order.platform + ": "}</span><span style={{ float: 'right' }}>{(order.order_cost + order.shipping_cost + order.insurance_cost).toFixed(2)} €</span>
        </Typography>

      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Box}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Prodotto</TableCell>
                <TableCell align="right">Quantità</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(quantities).map(product => (
                <TableRow key={product}>
                  <TableCell component="th" scope="row">{product}</TableCell>
                  <TableCell align="right">{quantities[product]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  </div>
}

export default App;