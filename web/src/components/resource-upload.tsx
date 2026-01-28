"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resourcesService } from "@/services/api.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ResourceUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            await resourcesService.upload(file);
            toast.success("Fichier téléchargé avec succès");
            setFile(null);
            // Reset input
            const input = document.getElementById("file-upload") as HTMLInputElement;
            if (input) input.value = "";

            if (onUploadComplete) onUploadComplete();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors du téléchargement");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex gap-4 items-center">
            <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="max-w-xs cursor-pointer"
            />
            <Button onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi...
                    </>
                ) : (
                    "Uploader"
                )}
            </Button>
        </div>
    );
}
