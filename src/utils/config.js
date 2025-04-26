// Configurações do frontend baseadas no ambiente
const getConfig = () => {
  // Ambiente do Next.js
  const env = process.env.NEXT_PUBLIC_ENV || 'development';
  
  // Configurações base
  const baseConfig = {
    env,
    isProduction: env === 'production',
    isStaging: env === 'staging',
    isDevelopment: env === 'development',
  };
  
  // Configurações específicas por ambiente
  const envConfig = {
    production: {
      apiUrl: 'https://api.hangoverclub.com',
      imageUrl: 'https://storage.hangoverclub.com',
      analytics: true,
    },
    staging: {
      apiUrl: 'https://api-staging.hangoverclub.com',
      imageUrl: 'https://storage-staging.hangoverclub.com',
      analytics: true,
    },
    development: {
      apiUrl: 'http://localhost:5000/api',
      imageUrl: 'http://localhost:5000/uploads',
      analytics: false,
    },
  };
  
  // Mesclar configurações
  return {
    ...baseConfig,
    ...envConfig[env],
  };
};

// Exportar configuração
const config = getConfig();
export default config;
