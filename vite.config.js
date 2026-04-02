import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const processEnv = {
    ...env,
    NODE_ENV: mode
  }

  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[name]'
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    define: {
      'process.env': JSON.stringify(processEnv)
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.port || env.npm_config_port || 80),
      open: true,
      proxy: {
        [env.VUE_APP_BASE_API]: {
          target: 'http://t-inspect-1.zh-hongyu.cn:9999/',
          changeOrigin: true,
          rewrite: p => p.replace(new RegExp(`^${env.VUE_APP_BASE_API}`), '')
        }
      }
    },
    build: {
      sourcemap: false,
      outDir: 'dist',
      assetsDir: 'static'
    }
  }
})
