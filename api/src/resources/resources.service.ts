import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        // Return seed data if DB is empty for demo purposes
        const resources = await this.prisma.resource.findMany({
            orderBy: { updatedAt: 'desc' },
        });

        if (resources.length === 0) {
            return this.getMockResources();
        }

        return resources;
    }

    async findOne(id: string) {
        // Check mock data first if using it
        const mock = this.getMockResources().find(r => r.id === id);
        if (mock) return mock;

        const resource = await this.prisma.resource.findUnique({
            where: { id },
        });

        if (!resource) throw new NotFoundException('Document non trouvé');
        return resource;
    }

    private getMockResources() {
        return [
            {
                id: '1',
                title: "Script d'Ouverture Cold Call v3.1",
                category: "scripts",
                type: "PDF",
                url: "#",
                size: "245 KB",
                description: "Script optimisé pour les premiers contacts téléphoniques",
                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            },
            {
                id: '2',
                title: "Traitement Objection Prix",
                category: "scripts",
                type: "PDF",
                url: "#",
                size: "182 KB",
                description: "Réponses structurées aux objections liées au budget",
                updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            },
            {
                id: '3',
                title: "Deck Présentation Corporate",
                category: "marketing",
                type: "PPTX",
                url: "#",
                size: "4.2 MB",
                description: "Présentation officielle Uprising Node pour prospects",
                updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            },
            {
                id: '4',
                title: "One-Pager Services",
                category: "marketing",
                type: "PDF",
                url: "#",
                size: "520 KB",
                description: "Résumé exécutif des services et tarification",
                updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            },
            {
                id: '5',
                title: "Framework Closing Enterprise",
                category: "strategies",
                type: "PDF",
                url: "#",
                size: "890 KB",
                description: "Méthodologie de closing pour comptes stratégiques",
                updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            },
            {
                id: '6',
                title: "Contrat Partenariat Type",
                category: "legal",
                type: "DOCX",
                url: "#",
                size: "156 KB",
                description: "Template de contrat partenaire standard",
                updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
            },
        ];
    }
}
