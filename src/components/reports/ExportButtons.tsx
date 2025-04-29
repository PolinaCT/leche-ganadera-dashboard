
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonsProps {
  onExportExcel: () => void;
  onExportPDF: () => void;
}

const ExportButtons = ({ onExportExcel, onExportPDF }: ExportButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onExportExcel}>
        <Download className="mr-2 h-4 w-4" />
        Exportar a Excel
      </Button>
      <Button variant="outline" onClick={onExportPDF}>
        <Download className="mr-2 h-4 w-4" />
        Exportar a PDF
      </Button>
    </div>
  );
};

export default ExportButtons;
