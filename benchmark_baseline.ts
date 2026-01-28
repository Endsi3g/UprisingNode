async function getStatsBaseline() {
    const start = performance.now();

    // Simulate current implementation in web/src/services/api.service.ts
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                currentBalance: 12450,
                targetBalance: 15000,
                activeLeads: 7,
                inAudit: 3,
                signedDeals: 12,
                monthlyGrowth: 18
            });
        }, 500);
    });

    const end = performance.now();
    console.log(`Baseline Execution Time: ${(end - start).toFixed(2)}ms`);
}

getStatsBaseline();
