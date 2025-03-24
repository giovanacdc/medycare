"use server"

import { ID, Query } from "node-appwrite"
import { InputFile } from "node-appwrite/file"
import { BUCKET_ID, DATABASE_ID, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, databases, storage, users,} from "../appwrite.config";
import { parseStringify } from "../utils"

export const createUser = async (user: CreateUserParams) => {
    try {
        const newuser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
        console.log({newuser})

        return parseStringify({newuser})
    } catch (error: any) {
       if(error && error?.code === 409){
        const documents = await users.list([
            Query.equal('email', [user.email])
        ])

        return documents?.users[0]

       } 
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId)

        return parseStringify(user)
    } catch (error) {
        console.log(error)
    }
}

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        let file;

        // Verifica se identificationDocument é uma instância de FormData
        if (identificationDocument && identificationDocument instanceof FormData) {
            // Obtém o arquivo (Blob) e o nome do arquivo do FormData
            const blobFile = identificationDocument.get('blobFile') as Blob;
            const fileName = identificationDocument.get('fileName') as string;

            // Verifica se os valores existem
            if (blobFile && fileName) {
                // Cria um InputFile a partir do Blob e do nome do arquivo
                const inputFile = InputFile.fromBuffer(blobFile, fileName);

                // Faz o upload do arquivo para o Appwrite Storage
                file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
            }
        }

        // Cria o documento do paciente no banco de dados
        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null, // ID do arquivo no Storage
                identificationDocumentUrl: file
                    ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
                    : null, // URL do arquivo no Storage
                ...patient, // Outros dados do paciente
            }
        );

        return parseStringify(newPatient);
    } catch (error) {
        console.log("Ocorreu um erro ao criar um novo paciente:", error);
    }
};

export const getPatient = async (userId: string) => {
    try {
      const patients = await databases.listDocuments(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        [Query.equal("userId", [userId])]
      );
  
      return parseStringify(patients.documents[0])
    } catch (error) {
      console.error(
        "Ocorreu um erro ao obter os detalhes do paciente.", error)
    }
}