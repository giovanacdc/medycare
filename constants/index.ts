export const GenderOptions = ['masculino', 'feminino', 'outro']

export const IdentificationTypes = [
    "Carteira de Identidade",
    "Carteira de motorista",
  ];

  export const PatientFormDefaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: new Date(Date.now()),
    gender: "masculino" as Gender,
    address: "",
    occupation: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    primaryPhysician: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    allergies: "",
    currentMedication: "",
    familyMedicalHistory: "",
    pastMedicalHistory: "",
    identificationType: "Carteira de Identidade",
    identificationNumber: "",
    identificationDocument: [],
    treatmentConsent: false,
    disclosureConsent: false,
    privacyConsent: false,
  };

export const Doctors = [
    {
      image: "/assets/images/dr-green.png",
      name: "Luis Fabiano",
    },
    {
      image: "/assets/images/dr-cameron.png",
      name: "Marcela Lima",
    },
    {
      image: "/assets/images/dr-livingston.png",
      name: "João Silva",
    },
    {
      image: "/assets/images/dr-peter.png",
      name: "Roberto Amaral",
    },
    {
      image: "/assets/images/dr-powell.png",
      name: "Gisele Ferreira",
    },
    {
      image: "/assets/images/dr-remirez.png",
      name: "Rogério Ceni",
    },
    {
      image: "/assets/images/dr-lee.png",
      name: "Rebbeca Gomez",
    },
    {
      image: "/assets/images/dr-cruz.png",
      name: "Nicole Cucco",
    },
    {
      image: "/assets/images/dr-sharma.png",
      name: "Luciano Neves",
    },
  ];

  export const StatusIcon = {
    agendado: "/assets/icons/check.svg",
    aguardando: "/assets/icons/pending.svg",
    cancelado: "/assets/icons/cancelled.svg",
  }