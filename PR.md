# PR.md

Este documento descreve os passos seguidos para configurar e executar o programa realizado.

---

## 1. Persistência de Dados e Importação com MongoDB

1. **Mudanças aplicadas ao dataset**:

   * O campo `id` foi renomeado para `_id` (a partir da execução do script Python).
   * O ingrediente `(if needed) Sugar` foi manualmente alterado para `Sugar`.

Assim, é gerado o ficheiro `dataset_ready.json`, pronto para importação.

2. **Importação para o Mongo**:

   ```bash
   docker volume create recursoEW
   docker run -d -p 27017:27017 --name recursoEW -v recursoEW:/data/db mongo
   docker cp dataset_ready.json recursoEW:/tmp
   docker exec -it recursoEW sh
   mongoimport -d cocktails -c cocktails /tmp/dataset_ready.json --jsonArray
   ```

Após executar esses passos, a base `cocktails` será criada com a coleção `cocktails` populada.

---

## 2. Setup da API (ex1)

1. **Instalar dependências**:

   ```bash
   cd ex1
   npm i
   ```

2. **Executar**:

   ```bash
   npm start
   ```

   * A API ficará disponível em `http://localhost:18000`.

---

## 2. Setup da Interface (ex2)

1. **Instalar dependências**:

   ```bash
   cd ex2
   npm i
   ```

2. **Executar**:

   ```bash
   npm start
   ```

   * A aplicação estará disponível em `http://localhost:18001`.
