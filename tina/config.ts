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
		type: "number" as const,
		name: "seriesOrder",
		label: "系列順序",
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
					exclude: "**/{my-speech,my-certificate,my-cve,nist-zerotrust,cloudflare,container,entra-id,azure-devops,google-cloud,google-workspace,software,citizen-digital-certificate}/**",
				},
				fields: postFields,
			},
			{
				name: "mySpeech",
				label: "我的演講",
				path: "src/content/posts/my-speech",
				format: "md",
				fields: postFields,
			},
			{
				name: "myCertificate",
				label: "我的證照",
				path: "src/content/posts/my-certificate",
				format: "md",
				fields: postFields,
			},
			{
				name: "myCve",
				label: "我的 CVE",
				path: "src/content/posts/my-cve",
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
				name: "cloudflare",
				label: "Cloudflare",
				path: "src/content/posts/cloudflare",
				format: "md",
				fields: postFields,
			},
			{
				name: "container",
				label: "Container",
				path: "src/content/posts/container",
				format: "md",
				fields: postFields,
			},
			{
				name: "entraId",
				label: "Entra ID",
				path: "src/content/posts/entra-id",
				format: "md",
				fields: postFields,
			},
			{
				name: "azureDevops",
				label: "Azure DevOps",
				path: "src/content/posts/azure-devops",
				format: "md",
				fields: postFields,
			},
			{
				name: "googleCloud",
				label: "Google Cloud",
				path: "src/content/posts/google-cloud",
				format: "md",
				fields: postFields,
			},
			{
				name: "googleWorkspace",
				label: "Google Workspace",
				path: "src/content/posts/google-workspace",
				format: "md",
				fields: postFields,
			},
			{
				name: "software",
				label: "軟體",
				path: "src/content/posts/software",
				format: "md",
				fields: postFields,
			},
			{
				name: "citizenDigitalCertificate",
				label: "自然人憑證",
				path: "src/content/posts/citizen-digital-certificate",
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
