
import React, { Children } from 'react'
import { Interface } from 'readline'
import { string } from 'zod'
import { Button } from './button'
import Image from 'next/image'

interface ButtonProps {
    isLoading: boolean,
    className?: string,
    children: React.ReactNode,
}

const SubmitButton = ({isLoading, className, children}: ButtonProps) => {
  return (
    <div>
      <Button type="submit" disabled={isLoading} className={className ?? 'shad-primary-btn w-full'}>
        {isLoading ? (
            <div className='flex items-center gap-4'>
                { <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="animated-spin"

                />}

                Carregando...
            </div>
        ): children
        }
      </Button>
    </div>
  )
}

export default SubmitButton
