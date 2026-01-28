"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout";
import { ResourceUpload } from "@/components/resource-upload";
import { resourcesService } from "@/services/api.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Resource {
    id: string;
    title: string;
    type: string;
    url: string;
    size: string;
    description: string;
    updatedAt: string;
}

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);

    const fetchResources = async () => {
        try {
            const data = await resourcesService.getAll();
            setResources(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const getIcon = (type: string) => {
        return <FileText className="h-6 w-6 text-blue-500" />;
    };

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
            <Header userName="Utilisateur" userRole="Partenaire" />

            <main className="flex-1 p-6">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-serif text-black">Ressources</h1>
                            <p className="text-gray-500 mt-2">Documents et fichiers partagés</p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ajouter une ressource</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResourceUpload onUploadComplete={fetchResources} />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((resource) => (
                            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            {getIcon(resource.type)}
                                        </div>
                                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                            {resource.type}
                                        </span>
                                    </div>
                                    <h3 className="font-bold mb-2 truncate" title={resource.title}>{resource.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                        {resource.description || "Aucune description"}
                                    </p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-xs text-gray-400">{resource.size}</span>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${resource.url}`} target="_blank" rel="noopener noreferrer">
                                                <Download className="h-4 w-4 mr-2" />
                                                Télécharger
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
