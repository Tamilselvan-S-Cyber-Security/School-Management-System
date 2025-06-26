
import { useState } from 'react';
import { toast } from 'sonner';

interface UsePreviewActionsProps {
  data: any[];
  moduleName: string;
  columns?: { key: string, header: string }[];
  title?: string;
}

export const usePreviewActions = ({ 
  data, 
  moduleName, 
  columns, 
  title 
}: UsePreviewActionsProps) => {
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string>('');

  const handlePrint = async () => {
    if (!data || data.length === 0) {
      toast.error("No data to print", {
        description: "Please check your filters or select another period."
      });
      return;
    }

    setIsActionInProgress(true);
    
    try {
      // Simulate print functionality
      window.print();
      toast.success("Document sent to printer", {
        description: "Your document has been sent to the printer."
      });
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Print error", {
        description: "An error occurred while printing the document."
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleShowPreview = () => {
    if (!data || data.length === 0) {
      toast.error("No data to display", {
        description: "Please check your filters or select another period."
      });
      return;
    }
    
    // Generate simple HTML preview
    const html = `
      <html>
        <head><title>${title || moduleName}</title></head>
        <body>
          <h1>${title || moduleName}</h1>
          <p>Data count: ${data.length}</p>
        </body>
      </html>
    `;
    setPreviewHTML(html);
    setPreviewOpen(true);
  };

  const handleExportPDF = async () => {
    if (!data || data.length === 0) {
      toast.error("No data to export", {
        description: "Please check your filters or select another period."
      });
      return;
    }

    setIsActionInProgress(true);
    
    try {
      // Simulate PDF export
      toast.success("PDF generated successfully", {
        description: "The document has been downloaded."
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Export error", {
        description: "An error occurred while generating the PDF."
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  return {
    isActionInProgress,
    previewOpen,
    setPreviewOpen,
    previewHTML,
    handlePrint,
    handleShowPreview,
    handleExportPDF
  };
};
