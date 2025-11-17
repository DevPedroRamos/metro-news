import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Venda {
  id: number;
  cliente: string;
  empreendimento: string;
  bl?: string | null;
  unid?: string | null;
  data_do_contrato: string;
  vendedor_parceiro: string;
}

interface VendaSelectorProps {
  vendas: Venda[];
  selectedVendaId: number | null;
  onSelectVenda: (vendaId: number) => void;
}

export function VendaSelector({ vendas, selectedVendaId, onSelectVenda }: VendaSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const selectedVenda = vendas.find(v => v.id === selectedVendaId);

  // Filtrar vendas baseado no termo de busca
  const filteredVendas = vendas.filter(venda => {
    const searchLower = searchValue.toLowerCase();
    const clienteMatch = venda.cliente.toLowerCase().includes(searchLower);
    const empreendimentoMatch = venda.empreendimento.toLowerCase().includes(searchLower);
    const blocoMatch = venda.bl?.toLowerCase().includes(searchLower);
    const unidadeMatch = venda.unid?.toLowerCase().includes(searchLower);
    
    return clienteMatch || empreendimentoMatch || blocoMatch || unidadeMatch;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-gray-200 focus:border-red-500 focus:ring-red-500"
        >
          {selectedVenda ? (
            <div className="flex items-center gap-2 text-sm truncate">
              <span className="font-medium text-gray-900">{selectedVenda.cliente}</span>
              <span className="text-gray-400">-</span>
              <span className="text-gray-600">{selectedVenda.vendedor_parceiro}</span>
                      <span className="text-gray-400">-</span>
              <span className="text-gray-600">{selectedVenda.empreendimento}</span>
              {selectedVenda.bl && (
                <>
                  <span className="text-gray-400">-</span>
                  <span className="text-gray-600">Bloco: {selectedVenda.bl}</span>
                </>
              )}
              {selectedVenda.unid && (
                <>
                  <span className="text-gray-400">-</span>
                  <span className="text-gray-600">Unidade: {selectedVenda.unid}</span>
                </>
              )}
            </div>
          ) : (
            "Selecione uma venda..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Buscar por cliente, empreendimento, bloco ou unidade..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {filteredVendas.length === 0 ? (
              <CommandEmpty>
                {searchValue.length === 0 
                  ? "Nenhuma venda disponível" 
                  : "Nenhuma venda encontrada."}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredVendas.map((venda) => (
                  <CommandItem
                    key={venda.id}
                    value={venda.id.toString()}
                    onSelect={() => {
                      onSelectVenda(venda.id);
                      setOpen(false);
                      setSearchValue('');
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedVendaId === venda.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-900">{venda.cliente}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-gray-600">{venda.vendedor_parceiro}</span>
                      <span className="text-gray-400">-</span>

                      <span className="text-gray-600">{venda.empreendimento}</span>
                      {venda.bl && (
                        <>
                          <span className="text-gray-400">-</span>
                          <span className="text-gray-600">Bloco: {venda.bl}</span>
                        </>
                      )}
                      {venda.unid && (
                        <>
                          <span className="text-gray-400">-</span>
                          <span className="text-gray-600">Unidade: {venda.unid}</span>
                        </>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
