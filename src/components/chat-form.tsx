import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUp } from 'lucide-react'

export function ChatForm() {
  return (
    <form className="mt-auto flex gap-2">
      <Input placeholder="Mensagem UFPABot" />
      <Button size="icon">
        <ArrowUp />
      </Button>
    </form>
  )
}
