import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import EarningsPage from './page';
import { dashboardService } from '@/services/api.service';
import { useState } from 'react';

// Mock dependencies
vi.mock('@/services/api.service', () => ({
    dashboardService: {
        getCommissions: vi.fn(),
    },
}));

vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
    },
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
    default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

// Mock PageHeader and DataCard to simplify rendering
vi.mock('@/components/uprising/page-header', () => ({
    PageHeader: ({ title }: any) => <h1>{title}</h1>,
}));

vi.mock('@/components/uprising/data-card', () => ({
    DataCard: ({ label, value }: any) => <div>{label}: {value}</div>,
}));

describe('EarningsPage Performance', () => {
    const generateCommissions = (count: number) => {
        return Array.from({ length: count }, (_, i) => ({
            id: `id-${i}`,
            company: `Company ${i}`,
            type: 'closing' as const,
            amount: 100,
            date: '2023-01-01',
            status: (i % 2 === 0 ? 'paid' : 'pending') as 'paid' | 'pending' | 'processing',
        }));
    };

    const largeDataset = {
        totalEarnings: 10000,
        pendingEarnings: 5000,
        thisMonth: 1000,
        avgPerDeal: 100,
        history: generateCommissions(1000), // 1000 items
    };

    beforeEach(() => {
        (dashboardService.getCommissions as any).mockResolvedValue(largeDataset);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders and filters correctly', async () => {
        await act(async () => {
            render(<EarningsPage />);
        });

        // Wait for data to load
        await screen.findByText('Company 0');

        expect(screen.getByText('Commissions')).toBeDefined();
    });

    it('benchmark re-renders', async () => {
        // Harness to force re-renders
        const Harness = () => {
            const [count, setCount] = useState(0);
            return (
                <div>
                    <button onClick={() => setCount(c => c + 1)} data-testid="update-btn">Update</button>
                    <div data-testid="count">{count}</div>
                    <EarningsPage />
                </div>
            );
        };

        await act(async () => {
            render(<Harness />);
        });

        // Wait for initial data load
        await screen.findByText('Company 0');

        const startTime = performance.now();
        const iterations = 20; // 20 re-renders

        // Force re-renders
        for (let i = 0; i < iterations; i++) {
            await act(async () => {
                fireEvent.click(screen.getByTestId('update-btn'));
            });
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`Benchmark Duration (${iterations} re-renders, 1000 items): ${duration.toFixed(2)}ms`);
    }, 20000); // 20s timeout
});
