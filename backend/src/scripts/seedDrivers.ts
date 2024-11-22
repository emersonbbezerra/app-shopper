import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Driver from '../models/Driver';

dotenv.config();

const seedDrivers = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/app-shopper'
    );
    console.log('Conectado ao MongoDB');

    const existingDrivers = await Driver.countDocuments();
    if (existingDrivers > 0) {
      console.log('Os motoristas já foram adicionados anteriormente.');
      return;
    }

    const drivers = [
      {
        _id: 1,
        name: 'Homer Simpson',
        description:
          'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
        vehicle: 'Plymouth Valiant 1973 rosa e enferrujado',
        rating: 2,
        ratePerKm: 2.5,
        minKm: 1,
      },
      {
        _id: 2,
        name: 'Dominic Toretto',
        description:
          'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
        vehicle: 'Dodge Charger R/T 1970 modificado',
        rating: 4,
        ratePerKm: 5.0,
        minKm: 5,
      },
      {
        _id: 3,
        name: 'James Bond',
        description:
          'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
        vehicle: 'Aston Martin DB5 clássico',
        rating: 5,
        ratePerKm: 10.0,
        minKm: 10,
      },
    ];

    await Driver.insertMany(drivers);
    console.log('Motoristas adicionados com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar motoristas:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconexão do MongoDB concluída');
  }
};

seedDrivers();
