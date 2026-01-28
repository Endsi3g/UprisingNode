
import { ScraperService } from './src/scraper/scraper.service';
import * as http from 'http';

const HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
    <title>Benchmark Page</title>
    <meta name="description" content="This is a test page for benchmarking">
</head>
<body>
    <h1>Welcome to the Benchmark</h1>
    <h2>Subtitle 1</h2>
    <p>Some content here.</p>
    <h2>Subtitle 2</h2>
</body>
</html>
`;

const PORT = 4567;
const URL = `http://localhost:${PORT}`;

async function startServer() {
    return new Promise<http.Server>((resolve) => {
        const server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(HTML_CONTENT);
        });
        server.listen(PORT, () => resolve(server));
    });
}

async function runBenchmark() {
    console.log('Starting Benchmark Server...');
    const server = await startServer();

    console.log('Initializing ScraperService...');
    const scraperService = new ScraperService();
    // Manually call onModuleInit to simulate NestJS lifecycle and initialize the cluster
    await scraperService.onModuleInit();

    const iterations = 5;
    console.log(`Running ${iterations} iterations...`);

    const start = Date.now();

    const promises: Promise<any>[] = [];
    for (let i = 0; i < iterations; i++) {
        promises.push(scraperService.scrapeCompany(URL));
    }

    try {
        await Promise.all(promises);
    } catch (e) {
        console.error('Error during benchmark:', e);
    }

    const end = Date.now();
    const duration = end - start;

    console.log(`\nBenchmark Completed:`);
    console.log(`Total Time: ${duration}ms`);
    console.log(`Average Time per Request: ${duration / iterations}ms`);

    // Clean up
    await scraperService.onModuleDestroy();
    server.close();
    process.exit(0);
}

runBenchmark();
