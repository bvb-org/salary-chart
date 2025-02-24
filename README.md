# Salary Chart

A Next.js application that visualizes salary data and HICP (Harmonised Index of Consumer Prices) information for Romania. The project provides an interactive chart interface to analyze salary trends and economic indicators.

## Features

- 📊 Interactive salary visualization chart
- 📈 HICP (Harmonised Index of Consumer Prices) data integration
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time data updates
- 📱 Responsive design for all devices
- 🌐 Built with Next.js and TypeScript
- 📊 Metrics monitoring with Prometheus and Grafana

## Demo

### Video Tutorial (TODO)

[![Watch the video](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://youtu.be/VIDEO_ID)

## Setup with Docker Compose

The application comes with a complete stack including the main application, Prometheus for metrics collection, and Grafana for metrics visualization.

1. Clone the repository:
```bash
git clone https://github.com/qSharpy/salary-chart.git
cd salary-chart
```

2. Start the entire stack using Docker Compose:
```bash
docker compose up -d
```

3. Access the services:
- Main application: http://localhost:3001
- Prometheus metrics: http://localhost:9090
- Grafana dashboards: http://localhost:3002

To stop the services:
```bash
docker compose down
```

## Manual Docker Setup

If you want to run just the application without the monitoring stack:

1. Build the Docker image:
```bash
docker build -t salary-chart .
```

2. Run the container:
```bash
docker run -p 3000:3000 salary-chart
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Development

If you want to run the project locally without Docker:

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Docker
- Chart.js
- Prometheus (metrics collection)
- Grafana (metrics visualization)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
