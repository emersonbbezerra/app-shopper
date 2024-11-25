import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import RequestRide from './components/RequestRide';

function App() {
  return (
    <Container>
      <AppBar position="static" color="secondary" style={{ height: '80px' }}>
        <Toolbar style={{ justifyContent: 'center', height: '100%' }}>
          <Typography variant="h4" style={{ lineHeight: '80px' }}>
            Bem-vindo ao Sistema de Transporte Shopper
          </Typography>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<RequestRide />} />
        {/* Adicione outras rotas para as telas de Opções de Viagem e Histórico de Viagens */}
      </Routes>
    </Container>
  );
}

export default App;
