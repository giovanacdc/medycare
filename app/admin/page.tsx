
import { columns } from '@/components/table/columns'
import { DataTable } from '@/components/table/DataTable'
import { StatCard } from '@/components/ui/StatCard'
import { getRecentAppointmentsList } from '@/lib/actions/appointment.actions'
import Link from 'next/link'
import React from 'react'

const Admin = async () => {
    const appointments = await getRecentAppointmentsList()
    return (
        <div className="mx-auto flex max-w-7xl flex-col space-y-14">
            <header className="admin-header">
                <Link href="/" className="cursor-pointer">
                    <h1 className="h-8 w-fit">MedyCare</h1>
                </Link>

                <p className="text-16-semibold text-dark-600">Dashboard do Administrador</p>
            </header>

            <main className="admin-main">
                <section className="w-full space-y-4">
                    <h1 className="header">Bem-vindo</h1>
                    <p className="text-dark-600">Vamos administrar os novos agendamentos!</p>
                </section>

                <section className="admin-stat">
                    <StatCard
                        type="agendamentos"
                        count={appointments.scheduledCount}
                        label="Agendamentos marcados"
                        icon="/assets/icons/appointments.svg"
                    />

                    <StatCard
                        type="aguardando"
                        count={appointments.pendingCount}
                        label="Agendamentos pendentes"
                        icon="/assets/icons/pending.svg"
                    />

                    <StatCard
                        type="cancelado"
                        count={appointments.cancelledCount}
                        label="Agendamentos cancelados"
                        icon="/assets/icons/cancelled.svg"
                    />
                </section>

                <DataTable columns={columns} data={ appointments.documents} />
            </main>
        </div>
    )
}

export default Admin
