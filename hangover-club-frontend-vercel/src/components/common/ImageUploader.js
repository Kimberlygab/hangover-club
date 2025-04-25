import React from 'react';
import Image from 'next/image';
import { useStorage } from '../context/StorageContext';

const ImageUploader = ({ onUploadComplete, userId, className = '' }) => {
  const { uploading, progress, error, upload } = useStorage();
  const [preview, setPreview] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.length) return;
    
    const file = fileInputRef.current.files[0];
    const result = await upload(file, userId);
    
    if (result.success) {
      // Limpar preview e input após upload bem-sucedido
      setPreview(null);
      fileInputRef.current.value = '';
      
      // Chamar callback com URL da imagem
      if (onUploadComplete) {
        onUploadComplete(result.url, result.path);
      }
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Área de seleção de arquivo */}
      <div className="w-full mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione uma imagem
        </label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700
            hover:file:bg-purple-100"
          disabled={uploading}
        />
      </div>

      {/* Preview da imagem */}
      {preview && (
        <div className="mb-4 relative w-full max-w-md h-48 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}

      {/* Barra de progresso */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
          <p className="text-sm text-gray-500 mt-1">Enviando... {progress}%</p>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="text-red-500 text-sm mb-4">
          Erro: {error}
        </div>
      )}

      {/* Botão de upload */}
      <button
        onClick={handleUpload}
        disabled={!preview || uploading}
        className={`px-4 py-2 rounded-md text-white font-medium
          ${
            !preview || uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }
        `}
      >
        {uploading ? 'Enviando...' : 'Enviar Imagem'}
      </button>
    </div>
  );
};

export default ImageUploader;
