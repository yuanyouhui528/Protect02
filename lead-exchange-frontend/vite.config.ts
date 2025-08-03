import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      vueJsx(),
      // 只在开发环境启用Vue DevTools
      ...(env.VITE_FEATURE_DEVTOOLS === 'true' ? [vueDevTools()] : []),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    // 环境变量配置
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    // 开发服务器配置
    server: {
      host: true,
      port: 5173,
      open: true,
      cors: true,
      // API代理配置
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    },
    // 构建配置
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: env.VITE_PROD_SOURCE_MAP === 'true',
      minify: env.VITE_PROD_MINIFY !== 'false' ? 'terser' : false,
      // 分包策略
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
                return 'vue'
              }
              if (id.includes('element-plus')) {
                return 'elementPlus'
              }
              if (id.includes('echarts')) {
                return 'echarts'
              }
              if (id.includes('axios') || id.includes('dayjs')) {
                return 'utils'
              }
              return 'vendor'
            }
          }
        }
      }
    },
    // CSS配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },
    // 优化配置
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus/es',
        'element-plus/es/components/message/style/css',
        'element-plus/es/components/notification/style/css',
        'element-plus/es/components/message-box/style/css',
        'echarts',
        'axios'
      ]
    }
  }
})
