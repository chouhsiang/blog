import { defineConfig } from "tinacms";

const branch =
	process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

const postFields = [
	{
		type: "string" as const,
		name: "title",
		label: "標題",
		isTitle: true,
		required: true,
	},
	{
		type: "datetime" as const,
		name: "published",
		label: "發佈日期",
		required: true,
		ui: {
			dateFormat: "YYYY-MM-DD",
		},
	},
	{
		type: "datetime" as const,
		name: "updated",
		label: "更新日期",
		ui: {
			dateFormat: "YYYY-MM-DD",
		},
	},
	{
		type: "string" as const,
		name: "description",
		label: "摘要",
		ui: {
			component: "textarea",
		},
	},
	{
		type: "image" as const,
		name: "image",
		label: "封面圖",
	},
	{
		type: "string" as const,
		name: "tags",
		label: "標籤",
		list: true,
	},
	{
		type: "string" as const,
		name: "category",
		label: "分類",
	},
	{
		type: "string" as const,
		name: "lang",
		label: "語言",
	},
	{
		type: "boolean" as const,
		name: "draft",
		label: "草稿",
	},
	{
		type: "rich-text" as const,
		name: "body",
		label: "內文",
		isBody: true,
	},
];

export default defineConfig({
	branch,
	clientId: null,
	token: null,
	build: {
		outputFolder: "admin",
		publicFolder: "public",
	},
	media: {
		tina: {
			mediaRoot: "images/medium",
			publicFolder: "public",
		},
	},
	schema: {
		collections: [
			{
				name: "post",
				label: "文章",
				path: "src/content/posts",
				format: "md",
				match: {
					exclude: "**/{speech,certificate,cve,nist-zerotrust,cloudflare-basic,azuread-basic}/**",
				},
				fields: postFields,
			},
			{
				name: "speech",
				label: "演講",
				path: "src/content/posts/speech",
				format: "md",
				fields: postFields,
			},
			{
				name: "certificate",
				label: "證照",
				path: "src/content/posts/certificate",
				format: "md",
				fields: postFields,
			},
			{
				name: "cve",
				label: "CVE",
				path: "src/content/posts/cve",
				format: "md",
				fields: postFields,
			},
			{
				name: "nistZerotrust",
				label: "NIST 零信任",
				path: "src/content/posts/nist-zerotrust",
				format: "md",
				fields: postFields,
			},
			{
				name: "cloudflareBasic",
				label: "Cloudflare 入門",
				path: "src/content/posts/cloudflare-basic",
				format: "md",
				fields: postFields,
			},
			{
				name: "azureadBasic",
				label: "Azure AD 入門",
				path: "src/content/posts/azuread-basic",
				format: "md",
				fields: postFields,
			},
			{
				name: "spec",
				label: "靜態頁",
				path: "src/content/spec",
				format: "md",
				fields: [
					{
						type: "rich-text" as const,
						name: "body",
						label: "內文",
						isBody: true,
					},
				],
			},
		],
	},
});
