## Prisma metrics tutorial

Reference code for ["Metrics for Your Database Using Prometheus, Grafana and Prisma"](https://www.prisma.io/blog/metrics-tutorial-prisma-pmoldgq10kz).


This branch reflects the code at the _end of the tutorial_.

For reference express server used at the _beginning of the tutorial_ go to the [`metrics-begin`](https://github.com/TasinIshmam/metrics-tutorial-prisma/tree/metrics-begin) branch.

### Installation

1. Clone this repository: `git clone git@github.com:TasinIshmam/metrics-tutorial-prisma.git`.
2. Navigate to the cloned directory: `cd metrics-tutorial-prisma`.
3. Install dependencies: `npm install`.
4. Start the PostgreSQL, Prometheus and Grafana with Docker: `docker-compose up --force-recreate`.
5. Run migrations: `npx prisma migrate dev`.
6. Start the server: `npm run dev`.
7. Test the API endpoints using the load testing script: `npm run loadtest`.
8. Access Prometheus in [`http://localhost:9090`](http://localhost:9090).
9. Access Grafana in [`http://localhost:3000`](http://localhost:3000). 

More information about configuring Grafana is available starting with [this section](https://prisma.io/blog/metrics-tutorial-prisma-pmoldgq10kz#add-a-prometheus-data-source-to-grafana) of the tutorial.


