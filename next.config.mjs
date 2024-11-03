/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      extensionAlias: {
        '.js': ['.tsx', '.ts', '.jsx', '.js'],
      },
      turbo: {
        resolveAlias: {
          // Turbopack does not support standard ESM import paths yet
          './Sample.js': './app/Sample.tsx',
          /**
           * Critical: prevents " ⨯ ./node_modules/canvas/build/Release/canvas.node
           * Module parse failed: Unexpected character '�' (1:0)" error
           */
          canvas: './empty-module.ts',
        },
      },
    },
  };

export default nextConfig;
