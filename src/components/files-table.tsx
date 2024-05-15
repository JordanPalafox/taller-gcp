"use client";

import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FilesTable() {
  const [files, setFiles] = useState<string[]>([]);
  const pathname = usePathname();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const splitFiles = files.map((file: string) => {
    const split = file.split(",");
    const name = split[0];
    const date = split[1];

    return { name, date };
  });

  function convertirFecha(stringFecha: string) {
    // Parsear el timestamp como número
    const timestamp = parseInt(stringFecha);

    // Crear un objeto Date con el timestamp
    const fecha = new Date(timestamp);

    // Formatear la fecha a DD/MM/YYYY HH:MM:SS
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Los meses comienzan desde 0
    const año = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, "0");
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    const segundos = fecha.getSeconds().toString().padStart(2, "0");

    // Crear el formato legible
    const formatoLegible = `${dia}/${mes}/${año} ${hora}:${minutos}:${segundos}`;

    return formatoLegible;
  }

  useEffect(() => {
    async function getFiles() {
      try {
        const response = await fetch("/api/storage", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setFiles(data);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getFiles();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (error) {
    return <div>Ocurrió un error al obtener los archivos</div>;
  }

  return (
    <Table>
      <TableCaption>Archivos</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
    <TableBody>
        {splitFiles.length > 0 ? (
            splitFiles.map((file) => (
                <tr key={file.name}>
                    <td className="pl-5">{file.name}</td>
                    <td className="pl-5">{convertirFecha(file.date)}</td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan={2} className="text-center py-2">No se han subido archivos</td>
            </tr>
        )}
    </TableBody>
    </Table>
  );
}
