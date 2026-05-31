import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "周詳程式筆記",
	subtitle: "程式筆記",
	lang: "zh_TW",
	themeColor: {
		hue: 0,
		fixed: true,
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png",
		position: "center",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "系列文章",
			children: [
				{
					name: "NIST 零信任文件",
					url: "/nist-zerotrust/",
				},
				{
					name: "Cloudflare",
					url: "/cloudflare/",
				},
				{
					name: "Entra ID",
					url: "/entra-id/",
				},
				{
					name: "Azure DevOps",
					url: "/azure-devops/",
				},
				{
					name: "自然人憑證",
					url: "/citizen-digital-certificate/",
				},
			],
		},
		{
			name: "關於作者",
			children: [
				{
					name: "關於我",
					url: "/about/",
				},
				{
					name: "我的演講",
					url: "/my-speech/",
				},
				{
					name: "我的證照",
					url: "/my-certificate/",
				},
				{
					name: "我的 CVE",
					url: "/my-cve/",
				},
			],
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg",
	name: "周詳 Sean Chou",
	bio: "零曜科技 執行長 hchou@zeroflare.tw",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/chouhsiang",
		},
		{
			name: "Facebook",
			icon: "fa6-brands:facebook",
			url: "https://www.facebook.com/chouhsiang.tw",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: false,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
