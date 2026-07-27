import "server-only";
import * as XLSX from "xlsx";

export function gerarPlanilhaBuffer(sheets: { nome: string; linhas: Record<string, any>[] }[]) {
  const workbook = XLSX.utils.book_new();

  for (const sheet of sheets) {
    const worksheet = XLSX.utils.json_to_sheet(sheet.linhas);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.nome.slice(0, 31));
  }

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

export function respostaXlsx(buffer: Buffer, nomeArquivo: string) {
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
    },
  });
}
