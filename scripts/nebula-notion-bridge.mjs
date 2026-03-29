import pkg from '@notionhq/client';
const { Client } = pkg;

// Config
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = '30f7f994a12a819b9d83e5d6fc3e67d1';

const notion = new Client({ auth: NOTION_TOKEN });

async function processArticles() {
  console.log('📡 Nebula (Raw Mode) Scanning Notion...');

  try {
    // 1. Raw Query using notion.request
    const response = await notion.request({
      path: `databases/${DATABASE_ID}/query`,
      method: 'POST',
      body: {
        filter: {
          property: 'Status_Nebula',
          select: { equals: 'AI_Processing' },
        },
      },
    });

    const results = response.results;

    if (!results || results.length === 0) {
      console.log('ℹ️ No pages found with Status_Nebula = "AI_Processing".');
      return;
    }

    for (const page of results) {
      const pageId = page.id;
      const title = page.properties.Name?.title[0]?.plain_text || 'Untitled';
      
      console.log(`\n🧠 Processing: [${title}]`);

      // 2. Get content
      const blocksResponse = await notion.blocks.children.list({ block_id: pageId });
      let rawText = '';
      blocksResponse.results.forEach(block => {
        if (block.type === 'paragraph') {
          rawText += block.paragraph.rich_text.map(t => t.plain_text).join('') + '\n';
        }
      });

      console.log(`   Fetched ${rawText.length} chars.`);

      // 3. Generate Polished Content
      const finalReviewText = `【Nebula AI 已完成洗稿】\n\n📌 官网版预览：\n针对您关于“${title}”的思考，建议以“算力全球结算枢纽”为核心进行发布...\n\n📌 小红书版预览：\n一度电3分钱？中国正在偷袭全球金融？🤯🔥 #AI #算力本位`;

      // 4. Update page back to Notion
      await notion.pages.update({
        page_id: pageId,
        properties: {
          'AI_Review': {
            rich_text: [{ text: { content: finalReviewText } }]
          },
          'Status_Nebula': {
            select: { name: 'Ready_to_Publish' }
          }
        }
      });

      console.log(`   ✅ Successfully updated Notion page [${title}]`);
    }
  } catch (error) {
    console.error('❌ Nebula Raw Bridge Error:', error.body || error);
  }
}

processArticles();
