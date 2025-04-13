import clsx from "clsx"
import Image from "next/image"

type StatCardProps = {
  type: 'agendamentos' | 'aguardando' | 'cancelado'
  count: number
  label: string
  icon: string
}

export const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <div
      className={clsx('stat-card', {
        'bg-agendamentos': type === 'agendamentos',
        'bg-aguardando': type === 'aguardando',
        'bg-cancelado': type === 'cancelado',
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt="agendamentos"
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-dark-700">{count}</h2>
      </div>

      <p className="text-14-regular text-dark-600">{label}</p>
    </div>
  )
}