import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

interface UpgradeButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  showIcon?: boolean
}

export function UpgradeButton({
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
}: UpgradeButtonProps) {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PRO_PAYMENT_LINK || ''

  return (
    <Link href={paymentLink} target="_blank" rel="noopener noreferrer">
      <Button variant={variant} size={size} className={className}>
        {showIcon && <Sparkles className="h-4 w-4 mr-2" />}
        Upgrade to Pro
      </Button>
    </Link>
  )
}
