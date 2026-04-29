import { app } from "./app.js";
import { env } from "./config/env.js";
import { testDatabaseConnection } from "./database/connection.js";

async function bootstrap() {
  // A API so abre porta depois de confirmar o banco, deixando falhas de ambiente visiveis no start.
  await testDatabaseConnection();

  app.listen(env.PORT, () => {
    console.log(`API rodando em http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar API", error);
  process.exit(1);
});
