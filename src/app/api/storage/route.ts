import { Storage } from "@google-cloud/storage";
import fs from "fs";
import { writeFile } from "fs/promises";
const archiver = require("archiver");
const uuid = require("uuid");
import path from "path";

const serviceAccount = {
  projectId: process.env.GCP_PROJECT_ID,
  clientEmail: process.env.GCP_CLIENT_EMAIL,
  privateKey: process.env.GCP_PRIVATE_KEY,
};

const storage = new Storage({
  projectId: serviceAccount.projectId,
  credentials: {
    client_email: serviceAccount.clientEmail,
    private_key: serviceAccount.privateKey,
  },
});

const bucketName = process.env.GCP_STORAGE_BUCKET_NAME as string;

export async function GET(request: Request) {
  try {
    // get files from bucket
    const [files] = await storage.bucket(bucketName).getFiles();
    const fileNames = files.map((file) => file.name);
    // order by timestamp
    fileNames.sort((a, b) => {
      const aTimestamp = parseInt(a.split(",")[3]);
      const bTimestamp = parseInt(b.split(",")[3]);
      return bTimestamp - aTimestamp;
    });
    return new Response(JSON.stringify(fileNames), { status: 200 });
  } catch (error) {
    console.error("Error al obtener los archivos:", error);
    return new Response("Error al obtener los archivos", { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      // Recibe el archivo de la solicitud
      const formData = await request.formData();
      const file = formData.get("file") as File;
  
      if (!file) {
        return new Response("No se ha proporcionado ningún archivo", { status: 400 });
      }
  
      // Define el directorio temporal
      let directory = path.join("/tmp");
      if (!fs.existsSync(directory)) {
        directory = path.join(process.cwd(), "src", "tmp");
      }
  
      // Lee el archivo y lo escribe en el sistema de archivos
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(directory, file.name);
      await writeFile(filePath, fileBuffer);
  
      // Genera un nombre de archivo único para el archivo a subir
      const uniqueFileName = `${uuid.v4()},${Date.now()}_${file.name}`;
  
      // Sube el archivo a Cloud Storage
      await storage.bucket(bucketName).upload(filePath, {
        destination: uniqueFileName,
        metadata: { contentType: "text/csv" },
      });
  
      // Elimina el archivo temporal
      fs.unlinkSync(filePath);
  
      console.log("Archivo subido a Cloud Storage");
      return new Response("Archivo subido a Cloud Storage", { status: 200 });
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      return new Response("Error al subir el archivo", { status: 500 });
    }
  }