import { createTable } from './createUsersTable'

async function runMigrations() {
  await createTable()
  console.log('Migrations rodadas com sucesso')
}

runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Erro ao rodar migrations', error)
    process.exit(1)
  })
