import type { Config } from 'tailwindcss'
import { h } from 'vue'

export default {
    darkMode: ['class'],
    content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
  	extend: {
  		colors: {
  			theme: '#1D5FCC',//主题颜色
  			blue: {
				dark: '#2574E9',          // 主品牌色。用于最重要的按钮、链接和品牌标识。
				medium: '#3C8AFF',         // 优化为“悬停亮蓝色”。用于交互元素的悬停状态，反馈积极明快。
				light: '#EBF2FF',          // 优化为“高亮淡蓝色”。用于需要突出显示的区域背景，如热门套餐。
				pale: '#F5F7FA',          // 保持不变。作为页面主背景色，非常出色。
				accent: '#2574E9',         // 优化为与主色一致。在蓝白主题下，用主色作为强调色能保持统一。
				h1: '#2574E9',              // 优化为“专业深灰蓝”。比纯黑更柔和，比#357ABD更稳重，可读性更高。
				h1p: '#000',             // 优化为“中性灰”。用于副标题，与主标题形成优雅的对比。
				nav: '#FFFFFF',             // 优化为“纯白”。让导航栏更干净、现代，并使用阴影来与页面区分。
				navtext: '#4A5568',         // 优化为“导航灰”。清晰、沉稳的导航文字颜色。
				badge: '#2574E9',            // 优化为“品牌蓝”。在蓝白主题中，用主色做徽章比粉色更和谐。
				button: '#2574E9',          // 保持不变。主按钮颜色。
				buttontext: '#FFFFFF',      // 保持不变。按钮文字。
				buttonhover: '#3C8AFF',      // 优化为“悬停亮蓝色”，与 blue.medium 统一，交互反馈更佳。
				footer: '#2574E9',          // 页脚中的主色，可用于标题或重要链接。
				footertext: '#718096',      // 优化为“中性灰”，在浅色页脚背景上更柔和、易读。
				footerhover: '#1E63C7',      // 优化为“深蓝色”，提供一个沉稳的悬停效果。
				footerbg: '#F5F7FA',        // 保持不变。使用与页面背景相同的颜色，打造轻量化页脚。
				footerborder: '#E2E8F0',     // 优化为“中性分割线灰”。用于页脚顶部分割线，比#BED5DE更通用。
				footerborderhover: '#2574E9',// 链接或带边框元素的悬停颜色。
				footerborderbg: '#F5F7FA',  // 带边框元素的背景色，保持与页脚背景一致。
				logo: '#2574E9',            // 优化为“主品牌色”，强化品牌一致性。
				parameters: '#1E63C7',      // 优化为“深蓝色”，适合设置等不太需要强调的交互点。
				backtotop: '#2574E9',       // 返回顶部按钮，使用主色。
				pricing: '#FFFFFF',         // 优化为“纯白”，作为定价卡片的背景色。
				pricingtext: '#718096',    // 定价卡片中的描述文字。
				pricinghover: '#2574E9',    // 当鼠标悬停在整个卡片上时，边框或标题变为此颜色。
				pricingborder: '#E2E8F0',    // 优化为“中性分割线灰”，作为卡片默认边框。
				pricingPopular: '#EBF2FF',  // 优化为“高亮淡蓝色”，作为热门套餐的背景，优雅地突出显示。
				pricingborderhover: '#2574E9',// 悬停时边框颜色变为品牌蓝。
				pricingborderbg: '#FFFFFF', // 卡片背景色。
				pricingbordertext: '#4A5568',// 卡片内文字颜色。
								pricingborderhovertext: '#2574E9',// 悬停时，文字颜色也变为品牌蓝，加强反馈。
				pricingborderbghover: '#FFFFFF',// 悬停时背景色保持不变，避免闪烁。
				pricingborderborder: '#E2E8F0', // 卡片默认边框色。
				inputtext: '#000000', // 输入框中提示词的专用黑色文字颜色。
 			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				hover: 'hsl(var(--primary-hover))',
  				light: 'hsl(var(--primary-light))',
  				dark: 'hsl(var(--primary-dark))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
  				hover: 'hsl(var(--secondary-hover))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))',
  				hover: 'hsl(var(--muted-hover))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))',
  				hover: 'hsl(var(--accent-hover))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))',
  				hover: 'hsl(var(--destructive-hover))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))',
  				hover: 'hsl(var(--success-hover))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))',
  				hover: 'hsl(var(--warning-hover))'
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				foreground: 'hsl(var(--info-foreground))',
  				hover: 'hsl(var(--info-hover))'
  			},
  			border: 'hsl(var(--border))',
  			input: {
  				DEFAULT: 'hsl(var(--input))',
  				hover: 'hsl(var(--input-hover))',
  				focus: 'hsl(var(--input-focus))'
  			},
  			ring: {
  				DEFAULT: 'hsl(var(--ring))',
  				offset: 'hsl(var(--ring-offset))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))',
  				'6': 'hsl(var(--chart-6))',
  				'7': 'hsl(var(--chart-7))',
  				'8': 'hsl(var(--chart-8))'
  			}
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-out forwards',
  			'slide-up': 'slideUp 0.5s ease-out forwards',
  			'slide-in-right': 'slideInRight 0.5s ease-out forwards',
  			'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
  			'zoom-in': 'zoomIn 0.5s ease-out forwards'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translate3d(0, 30px, 0)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translate3d(0, 0, 0)'
  				}
  			},
  			slideInRight: {
  				'0%': {
  					opacity: '0',
  					transform: 'translate3d(30px, 0, 0)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translate3d(0, 0, 0)'
  				}
  			},
  			slideInLeft: {
  				'0%': {
  					opacity: '0',
  					transform: 'translate3d(-30px, 0, 0)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translate3d(0, 0, 0)'
  				}
  			},
  			zoomIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale3d(0.95, 0.95, 1)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale3d(1, 1, 1)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			xl: 'var(--radius-lg)',
  			'2xl': 'var(--radius-xl)',
  			full: 'var(--radius-full)'
  		},
  		boxShadow: {
  			'sm': 'var(--shadow)',
  			'lg': 'var(--shadow-lg)',
  			'xl': 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)'
  		}
  	}
  },
} satisfies Config 