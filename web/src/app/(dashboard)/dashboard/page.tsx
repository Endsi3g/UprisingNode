import { leadsService } from "@/services/api.service";
import DashboardClient, { DashboardStats } from "./DashboardClient";

export default async function DashboardPage() {
    let stats: DashboardStats = {
        currentBalance: 0,
        targetBalance: 15000,
        activeLeads: 0,
        inAudit: 0,
        signedDeals: 0,
        monthlyGrowth: 0
    };

    try {
        stats = await leadsService.getStats() as unknown as DashboardStats;
    } catch (error) {
        console.error("Failed to fetch stats", error);
    }

    return <DashboardClient stats={stats} />;
}
