## Prisma metrics tutorial

Reference code for ["Metrics for Your Database Using Prometheus, Grafana and Prisma"](https://www.prisma.io/blog/metrics-tutorial-prisma-pmoldgq10kz).

### Installation

1. Clone this branch: `git clone -b metrics-begin git@github.com:TasinIshmam/metrics-tutorial-prisma.git`.
2. Navigate to the cloned directory: `cd metrics-tutorial-prisma`.
3. Install dependencies: `npm install`.
4. Start the PostgreSQL database on port 5432 with Docker: `docker-compose up`.
5. Run migrations: `npx prisma migrate dev`.
6. Start the server: `npm run dev`.
7. Test the API endpoints using the load testing script: `npm run loadtest`.
