import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import eslintPlugin from 'vite-plugin-eslint'
import Components from 'unplugin-vue-components/vite'
import { DevUiResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
	base: "/",
	// 静态资源服务的文件夹
	publicDir: "public",
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			'_@': resolve(__dirname, './src/assets'),
			'#': resolve(__dirname, './src/components'),
			'@@': resolve(__dirname, './src/views'),
			'page': resolve(__dirname, './src/views/page')
		},
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
	},
	server: {
		// 是否开启https
		https: false,
		// 端口号
		port: 9999,
		// 监听所有地址
		host: "192.168.0.200",
		// 启服务自动打开浏览器
		open: false,
		// 允许跨域
		cors: true,
		proxy: {
			'/api': {// 资源
				target: 'http://192.168.0.200:3000/',
				ws: true,   //// proxy websockets
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/api'
				}
			},
		},
	},
	// 插件配置
	plugins: [
		vue({
			refTransform: true,
			template: {
				compilerOptions: {
					isCustomElement: tag => /^micro-app/.test(tag)
				}
			}
		}),
		eslintPlugin({
			include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
		}),
		// 新增
		Components({
			resolvers: [
				DevUiResolver()
			],
			directoryAsNamespace: true
		})
	],
	build: {
		// 浏览器兼容目标 "esnext" | "modules"
		target: "modules",
		// 打包输出路径
		outDir: "dist",
		// 静态资源路径
		assetsDir: "assets",

		// 构建后是否生成 source map 文件
		sourcemap: false,
		//  chunk 大小警告的限制（以 kbs 为单位）
		chunkSizeWarningLimit: 2000,
		// 启用/禁用 gzip 压缩大小报告
		reportCompressedSize: false,
		// 开启 fast-refresh
		fastRefresh: true,
		// 关闭 HMR
		hmr: false,
		// 代码压缩配置
		// terserOptions: {
		//   // 生产环境移除console,drop_debugger
		//   compress: {
		//     drop_console: true,
		//     drop_debugger: true,
		//   },
		// }
	},
	define: {
		// 解决 process.env 找不到 (process is not defined)
		// 使用 import.meta.env.VITE_APP_BASE_API 调用环境变量
		"process.env": {},
	},
	css: {
		preprocessorOptions: {
			scss: {
				javascriptEnabled: true,
				/* .scss全局预定义变量，引入多个文件 以;(分号分割)*/
				// additionalData: `@import "./src/assets/styles/global.scss";@import "./src/assets/styles/element-variables.scss";`,
			}
		}
	}
});