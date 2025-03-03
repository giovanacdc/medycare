import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <h1>MedyCare</h1>

          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-200 xl:text-left">
              © 2025 MedyCare
            </p>
            <Link href="/?admin=true" className="text-purple-600"> 
              Admin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
