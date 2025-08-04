import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 开发环境性能优化标志
  const isDevOptimized = env.VITE_DEV_PERFORMANCE_MODE === 'true'
  const isDev = command === 'serve'
  
  return {
    plugins: [
      vue({
        // 开发环境优化：禁用模板编译缓存清理
        template: {
          compilerOptions: {
            // 开发环境下禁用一些编译时优化，加快编译速度
            hoistStatic: !isDevOptimized,
            cacheHandlers: !isDevOptimized
          }
        }
      }),
      // 开发环境优化：条件加载JSX插件
      ...(isDevOptimized ? [] : [vueJsx()]),
      // 只在开发环境且未启用性能模式时启用Vue DevTools
      ...(env.VITE_FEATURE_DEVTOOLS === 'true' && !isDevOptimized ? [vueDevTools()] : []),
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
      open: !isDevOptimized, // 性能模式下不自动打开浏览器
      cors: true,
      // 开发环境性能优化
      ...(isDevOptimized && {
        hmr: {
          overlay: false // 禁用错误覆盖层，减少渲染开销
        },
        fs: {
          strict: false // 放宽文件系统限制，加快文件访问
        }
      }),
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
      // 开发环境性能优化：禁用CSS代码分割
      cssCodeSplit: !(isDev && isDevOptimized),
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
      // 开发环境性能优化：减少预构建依赖
      include: isDevOptimized ? [
        'vue',
        'vue-router',
        'pinia',
        'axios'
      ] : [
        'vue',
        'vue-router',
        'pinia',
        'element-plus/es',
        'element-plus/es/components/message/style/css',
        'element-plus/es/components/notification/style/css',
        'element-plus/es/components/message-box/style/css',
        'echarts',
        'axios'
      ],
      // 开发环境性能优化：部分排除大型依赖的预构建
      ...(isDevOptimized && {
        exclude: ['@element-plus/icons-vue'],
        force: false // 不强制重新预构建
      })
    },
    
    // 开发环境esbuild性能优化配置
    esbuild: isDev && isDevOptimized ? {
      // 开发环境下设置编译目标，简化构建过程
      target: 'es2015',
      // 开发环境下禁用压缩以提高构建速度
      minify: false
    } : undefined
  }
})
