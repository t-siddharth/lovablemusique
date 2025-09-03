import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	safelist: [
		// Text colors for chromatic notes (base)
		'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500',
		'text-green-500', 'text-teal-500', 'text-cyan-500', 'text-blue-500',
		'text-indigo-500', 'text-violet-500', 'text-fuchsia-500', 'text-pink-500',
		// Background classes for dots (base)
		'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500',
		'bg-green-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500',
		'bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-pink-500',
		// Octave-specific background colors
		'bg-red-300', 'bg-orange-300', 'bg-yellow-300', 'bg-lime-300',
		'bg-green-300', 'bg-teal-300', 'bg-cyan-300', 'bg-blue-300',
		'bg-indigo-300', 'bg-violet-300', 'bg-fuchsia-300', 'bg-pink-300',
		'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400',
		'bg-green-400', 'bg-teal-400', 'bg-cyan-400', 'bg-blue-400',
		'bg-indigo-400', 'bg-violet-400', 'bg-fuchsia-400', 'bg-pink-400',
		'bg-red-700', 'bg-orange-700', 'bg-yellow-700', 'bg-lime-700',
		'bg-green-700', 'bg-teal-700', 'bg-cyan-700', 'bg-blue-700',
		'bg-indigo-700', 'bg-violet-700', 'bg-fuchsia-700', 'bg-pink-700',
		'bg-red-800', 'bg-orange-800', 'bg-yellow-800', 'bg-lime-800',
		'bg-green-800', 'bg-teal-800', 'bg-cyan-800', 'bg-blue-800',
		'bg-indigo-800', 'bg-violet-800', 'bg-fuchsia-800', 'bg-pink-800',
		// Octave-specific hover states
		'hover:bg-red-400', 'hover:bg-orange-400', 'hover:bg-yellow-400', 'hover:bg-lime-400',
		'hover:bg-green-400', 'hover:bg-teal-400', 'hover:bg-cyan-400', 'hover:bg-blue-400',
		'hover:bg-indigo-400', 'hover:bg-violet-400', 'hover:bg-fuchsia-400', 'hover:bg-pink-400',
		'hover:bg-red-800', 'hover:bg-orange-800', 'hover:bg-yellow-800', 'hover:bg-lime-800',
		'hover:bg-green-800', 'hover:bg-teal-800', 'hover:bg-cyan-800', 'hover:bg-blue-800',
		'hover:bg-indigo-800', 'hover:bg-violet-800', 'hover:bg-fuchsia-800', 'hover:bg-pink-800'
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			gridTemplateColumns: {
				'14': 'repeat(14, minmax(0, 1fr))',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
