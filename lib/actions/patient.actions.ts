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

        if (identificationDocument && identificationDocument instanceof FormData) {
            const blobFile = identificationDocument.get('blobFile') as Blob;
            const fileName = identificationDocument.get('fileName') as string;

            if (blobFile && fileName) {
                const inputFile = InputFile.fromBuffer(blobFile, fileName);

                file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
            }
        }

        
        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null, 
                identificationDocumentUrl: file
                    ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
                    : null, 
                ...patient, 
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