import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import './App.css';

function App() {
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
            <TableRow>
              <TableCell component="th" scope="row">Prodotto 1</TableCell>
              <TableCell align="right">10</TableCell>
              <TableCell align="right">$20</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Prodotto 2</TableCell>
              <TableCell align="right">5</TableCell>
              <TableCell align="right">$30</TableCell>
            </TableRow>
            {/* Aggiungi altri elementi della tabella qui */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
