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
  			theme: '#ec2657',
  			blue: {
  				dark: '#2574E9', // 导航栏使用颜色
  				medium: '#ec2657',
  				light: '#8B5CF6',
  				pale: '#F5F7FA', //背景使用颜色
  				accent: '#ec2657',
				h1: '#357ABD', //H1标题颜色
				h1p: '#000', //H1下副标题颜色
				nav:'#BED5DE', //导航背景颜色
				navtext:'#000000', //导航文字颜色
				badge:'#ec2657', //导航右上角徽章颜色
				button:'#2574E9', //按钮颜色
				buttontext:'#fff', //按钮文字颜色
				buttonhover:'#1D5FCC', //按钮悬停颜色
				footer:'#2574E9', //页脚主要使用颜色（导航栏使用颜色）
				footertext:'#000000', //页脚文字颜色
				footerhover:'#1D5FCC', //页脚悬停颜色
				footerbg:'#F5F7FA', //页脚背景颜色
				footerborder:'#BED5DE', //页脚边框颜色
				footerborderhover:'#1D5FCC', //页脚边框悬停颜色
				footerborderbg:'#F5F7FA', //页脚边框背景颜色
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