import { useState } from 'react';
import { Check, Copy } from 'lucide-react'; // Opcional: Iconos populares

interface CopyButtonProps {
  textToCopy: string;
}

export const ActionButton = ({ textToCopy }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Uso de la API moderna del portapapeles
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);

      // Revertir el estado tras 2 segundos para feedback visual
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center px-1! py-1! rounded-md transition-all bg-transparent ${
        isCopied ? 'text-gray-800' : 'text-gray-500 hover:text-gray-800'
      }`}> 
      {isCopied ? (
        <>
          <Check size={16} />
        </>
      ) : (
        <>
          <Copy size={16} />
        </>
      )}
    </button>
  )
};
