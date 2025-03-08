
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/context/ExpenseContext";
import { FileDown, FileUp } from "lucide-react";
import { toast } from "sonner";

const ImportExportButtons: React.FC = () => {
  const { exportExpenses, importExpenses } = useExpenses();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        importExpenses(parsedData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        toast.error("Failed to parse the imported file. Make sure it's a valid JSON file.");
      }
    };
    reader.readAsText(file);
    
    // Reset file input for future imports
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={exportExpenses}
        className="flex items-center gap-1"
      >
        <FileDown className="h-4 w-4" />
        Export
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleImportClick}
        className="flex items-center gap-1"
      >
        <FileUp className="h-4 w-4" />
        Import
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
      </Button>
    </div>
  );
};

export default ImportExportButtons;
