#!/bin/sh

# Executa o script de seeding
echo "Populando o banco de dados com motoristas..."
node dist/scripts/seedDrivers.js

# Verifica se o seeding foi bem-sucedido
if [ $? -ne 0 ]; then
  echo "Erro ao popular o banco de dados. Encerrando."
  exit 1
fi

# Inicia a aplicação
echo "Iniciando a aplicação..."
node dist/index.js