"use client";

import { usePathname } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function SectionHeader() {
    const pathname = usePathname().split("/")[1];
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    async function handleUpload() {
        setLoading(true);
        const fileInput = document.getElementById("file") as HTMLInputElement;

        if (fileInput) {
            const files = fileInput.files;

            if (!files || files.length === 0) {
                console.error("No se seleccionó ningún archivo");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            const file = files[0];
            formData.append("file", file);

            try {
                const response = await fetch("/api/storage", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    console.error("Ocurrió un error al subir el archivo");
                } else {
                    toast({
                        title: "Archivo subido",
                        description: "El archivo se ha subido correctamente.",
                    });
                }
                location.reload();
            } catch (error) {
                console.error("Error al subir el archivo:", error);
            } finally {
                setLoading(false);
            }
        } else {
            console.error("No se encontró el archivo o el formato");
            setLoading(false);
        }
    }

    return (
        <header className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold">
                    Archivos
                </h1>
            </div>
            <Dialog>
                <DialogTrigger className="border-2 border-black hover:font-bold hover:bg-black hover:text-white transition-all duration-300 text-left justify-center items-start">
                    <p className="px-8 py-2">Agregar</p>
                </DialogTrigger>
                <DialogContent className="w-[100vw] overflow-y-auto">
                    <DialogHeader className="text-center items-center">
                        <DialogTitle>Subir Archivo</DialogTitle>
                        <DialogDescription>Sube el archivo csv</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <Input id="file" type="file" accept=".csv" multiple={false} />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            onClick={() => handleUpload()}
                            className="border-2 border-black hover:font-bold hover:bg-black hover:text-white transition-all duration-300 text-left justify-center items-start px-4 py-2"
                            disabled={loading}
                        >
                            {loading ? "Subiendo" : "Subir"}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </header>
    );
}
