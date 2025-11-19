import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserSearch, type UserSearchResult } from '@/hooks/useUserSearch';

interface UserSelectorProps {
  onSelectUser: (user: UserSearchResult | null) => void;
  selectedUser: UserSearchResult | null;
  currentUserApelido?: string;
  currentUserRole?: string;
}

export function UserSelector({ onSelectUser, selectedUser, currentUserApelido, currentUserRole }: UserSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { users, loading } = useUserSearch(searchValue, currentUserApelido, currentUserRole);

  return (
    <div className="flex gap-2 items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 px-4 font-normal hover:bg-accent/50 transition-colors"
          >
            {selectedUser ? (
              <div className="flex items-center gap-2 truncate">
                <span className="font-medium">{selectedUser.name}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-sm">{selectedUser.apelido}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Selecione um usuário...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0" align="start">
          <Command shouldFilter={false} className="rounded-lg border-0">
            <div className="border-b px-3">
              <CommandInput 
                placeholder="Digite o apelido do usuário..." 
                value={searchValue}
                onValueChange={setSearchValue}
                className="h-12"
              />
            </div>
            <CommandList className="max-h-[350px]">
              {loading ? (
                <CommandEmpty className="py-8 px-4">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Buscando usuários...</span>
                  </div>
                </CommandEmpty>
              ) : users.length === 0 ? (
                <CommandEmpty className="py-8 px-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {searchValue.length < 2 
                        ? "Digite pelo menos 2 caracteres para buscar" 
                        : "Nenhum usuário encontrado"}
                    </p>
                    {searchValue.length >= 2 && (
                      <p className="text-xs text-muted-foreground">
                        Tente buscar por outro apelido
                      </p>
                    )}
                  </div>
                </CommandEmpty>
              ) : (
                <CommandGroup className="p-2">
                  {users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={() => {
                        onSelectUser(user);
                        setOpen(false);
                        setSearchValue('');
                      }}
                      className="px-3 py-3 cursor-pointer rounded-md aria-selected:bg-accent"
                    >
                      <Check
                        className={cn(
                          "mr-3 h-4 w-4 shrink-0",
                          selectedUser?.id === user.id ? "opacity-100 text-primary" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <span className="font-medium text-sm truncate">{user.name}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="truncate">{user.apelido}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="capitalize px-2 py-0.5 bg-muted rounded text-xs font-medium">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedUser && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSelectUser(null)}
          className="h-12 w-12 hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="Limpar seleção"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
