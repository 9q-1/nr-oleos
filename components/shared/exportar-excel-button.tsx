import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportarExcelButton({ tipo }: { tipo: "clientes" | "produtos" | "estoque" | "servicos" }) {
  return (
    <Button asChild variant="outline">
      <a href={`/api/exportar/${tipo}`} download>
        <FileSpreadsheet className="h-4 w-4" /> Exportar Excel
      </a>
    </Button>
  );
}
