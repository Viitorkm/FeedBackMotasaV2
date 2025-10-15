import database from './src/database/index.js';

async function syncColaboradores() {
  try {
    console.log('🔧 Sincronizando modelo Colaborador...');
    console.log(`Conectando no banco: ${database.connection.config.database}`);
    
    // Sincronizar apenas o modelo Colaborador
    await database.connection.models.Colaborador.sync({ force: false });
    
    console.log('✅ Tabela Colaboradores criada com sucesso!');
    
    // Verificar se a tabela foi criada
    const [tables] = await database.connection.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Colaboradores'"
    );
    
    if (tables.length > 0) {
      console.log('✅ Verificação: Tabela Colaboradores existe!');
      
      // Contar registros
      const count = await database.connection.models.Colaborador.count();
      console.log(`📊 Total de registros: ${count}`);
    } else {
      console.log('❌ Tabela Colaboradores não foi criada');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar:', error.message);
    process.exit(1);
  }
}

syncColaboradores();