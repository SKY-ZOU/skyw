import { PrismaClient } from '../src/app/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Setting
  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      companyName: 'SKYW Group',
      companyFull: 'Skyward Holding Group',
      email: 'info@skywgroup.com',
      phone: '+852 2888 8888',
    },
  });

  // Metrics
  const metrics = [
    {
      sortOrder: 0,
      valueZhCN: '5+', valueZhTW: '5+', valueEn: '5+',
      labelZhCN: '全球办公室', labelZhTW: '全球辦公室', labelEn: 'Global Offices',
    },
    {
      sortOrder: 1,
      valueZhCN: '2', valueZhTW: '2', valueEn: '2',
      labelZhCN: 'SFC牌照', labelZhTW: 'SFC牌照', labelEn: 'SFC Licenses',
    },
    {
      sortOrder: 2,
      valueZhCN: '6', valueZhTW: '6', valueEn: '6',
      labelZhCN: '业务板块', labelZhTW: '業務板塊', labelEn: 'Business Divisions',
    },
    {
      sortOrder: 3,
      valueZhCN: '20+年', valueZhTW: '20+年', valueEn: '20+ Yrs',
      labelZhCN: '行业经验', labelZhTW: '行業經驗', labelEn: 'Industry Experience',
    },
  ];
  for (const m of metrics) {
    await prisma.metric.create({ data: m });
  }

  // Offices
  const offices = [
    {
      slug: 'hk', sortOrder: 0,
      nameZhCN: '香港', nameZhTW: '香港', nameEn: 'Hong Kong',
      typeZhCN: '集团总部', typeZhTW: '集團總部', typeEn: 'Group Headquarters',
      addressZhCN: '香港中环皇后大道中99号中环中心',
      addressZhTW: '香港中環皇后大道中99號中環中心',
      addressEn: "The Center, 99 Queen's Road Central, Central, Hong Kong",
      phone: '+852 2888 8888', email: 'hk@skywgroup.com',
    },
    {
      slug: 'sz', sortOrder: 1,
      nameZhCN: '深圳', nameZhTW: '深圳', nameEn: 'Shenzhen',
      typeZhCN: '大湾区运营中心', typeZhTW: '大灣區運營中心', typeEn: 'GBA Operations Center',
      addressZhCN: '深圳市南山区科技园南区',
      addressZhTW: '深圳市南山區科技園南區',
      addressEn: 'Science Park South, Nanshan District, Shenzhen',
      phone: '+86 755 8888 8888', email: 'sz@skywgroup.com',
    },
    {
      slug: 'sg', sortOrder: 2,
      nameZhCN: '新加坡', nameZhTW: '新加坡', nameEn: 'Singapore',
      typeZhCN: '东南亚业务中心', typeZhTW: '東南亞業務中心', typeEn: 'Southeast Asia Hub',
      addressZhCN: '新加坡莱佛士坊一号',
      addressZhTW: '新加坡萊佛士坊一號',
      addressEn: 'One Raffles Quay, Singapore',
      phone: '+65 6888 8888', email: 'sg@skywgroup.com',
    },
    {
      slug: 'dubai', sortOrder: 3,
      nameZhCN: '迪拜', nameZhTW: '迪拜', nameEn: 'Dubai',
      typeZhCN: '中东业务中心', typeZhTW: '中東業務中心', typeEn: 'Middle East Hub',
      addressZhCN: '迪拜国际金融中心',
      addressZhTW: '迪拜國際金融中心',
      addressEn: 'Dubai International Financial Centre',
      phone: '+971 4 888 8888', email: 'dubai@skywgroup.com',
    },
    {
      slug: 'london', sortOrder: 4,
      nameZhCN: '伦敦', nameZhTW: '倫敦', nameEn: 'London',
      typeZhCN: '欧洲业务中心', typeZhTW: '歐洲業務中心', typeEn: 'Europe Hub',
      addressZhCN: '伦敦金融城',
      addressZhTW: '倫敦金融城',
      addressEn: 'City of London, London',
      phone: '+44 20 7888 8888', email: 'london@skywgroup.com',
    },
  ];
  for (const o of offices) {
    await prisma.office.create({ data: o });
  }

  // Business Divisions
  const divisions = [
    {
      divisionId: 'fund', slug: 'fund-management', icon: 'TrendingUp', sortOrder: 0,
      titleZhCN: '基金管理', titleZhTW: '基金管理', titleEn: 'Fund Management',
      shortDescZhCN: '为机构投资者及高净值客户提供专业的基金管理服务，投资策略涵盖股权、固定收益及另类资产。',
      shortDescZhTW: '為機構投資者及高淨值客戶提供專業的基金管理服務，投資策略涵蓋股權、固定收益及另類資產。',
      shortDescEn: 'Professional fund management services for institutional investors and HNW clients, with strategies spanning equity, fixed income, and alternative assets.',
    },
    {
      divisionId: 'ipo', slug: 'ipo-anchor', icon: 'Landmark', sortOrder: 1,
      titleZhCN: 'IPO基石投资', titleZhTW: 'IPO基石投資', titleEn: 'IPO Cornerstone Investment',
      shortDescZhCN: '作为专业的基石投资者参与优质企业IPO，为发行人提供信心背书，为投资者获取稀缺投资机会。',
      shortDescZhTW: '作為專業的基石投資者參與優質企業IPO，為發行人提供信心背書，為投資者獲取稀缺投資機會。',
      shortDescEn: 'Participating as professional cornerstone investors in quality IPOs, providing confidence endorsement for issuers and accessing scarce investment opportunities.',
    },
    {
      divisionId: 'gold', slug: 'gold', icon: 'Coins', sortOrder: 2,
      titleZhCN: '黄金 / G-COIN', titleZhTW: '黃金 / G-COIN', titleEn: 'Gold / G-COIN',
      shortDescZhCN: '通过G-COIN数字黄金平台，将传统黄金产业与数字金融创新深度融合，构建全产业链黄金生态系统。',
      shortDescZhTW: '通過G-COIN數字黃金平台，將傳統黃金產業與數字金融創新深度融合，構建全產業鏈黃金生態系統。',
      shortDescEn: 'Through the G-COIN digital gold platform, deeply integrating traditional gold industry with digital financial innovation to build a full-chain gold ecosystem.',
    },
    {
      divisionId: 'credit', slug: 'credit-guarantee', icon: 'ShieldCheck', sortOrder: 3,
      titleZhCN: '商业信用担保', titleZhTW: '商業信用擔保', titleEn: 'Commercial Credit Guarantee',
      shortDescZhCN: '为中小企业提供专业的信用担保和增信服务，助力企业融资发展，服务实体经济。',
      shortDescZhTW: '為中小企業提供專業的信用擔保和增信服務，助力企業融資發展，服務實體經濟。',
      shortDescEn: 'Professional credit guarantee and credit enhancement services for SMEs, facilitating enterprise financing and serving the real economy.',
    },
    {
      divisionId: 'energy', slug: 'energy', icon: 'Zap', sortOrder: 4,
      titleZhCN: '能源项目', titleZhTW: '能源項目', titleEn: 'Energy Projects',
      shortDescZhCN: '聚焦清洁能源和传统能源领域的投资机会，推动能源产业转型与可持续发展。',
      shortDescZhTW: '聚焦清潔能源和傳統能源領域的投資機會，推動能源產業轉型與可持續發展。',
      shortDescEn: 'Focused on investment opportunities in clean and traditional energy, driving energy industry transformation and sustainable development.',
    },
  ];
  for (const d of divisions) {
    await prisma.businessDivision.create({ data: d });
  }

  // Articles
  const articles = [
    {
      slug: 'skyw-strategic-partnership-2026',
      date: '2026-02-20',
      category: 'news',
      published: true,
      titleZhCN: 'SKYW集团与中东主权基金达成战略合作',
      titleZhTW: 'SKYW集團與中東主權基金達成戰略合作',
      titleEn: 'SKYW Group Establishes Strategic Partnership with Middle East Sovereign Fund',
      excerptZhCN: '天际控股集团与中东地区领先的主权财富基金签署战略合作备忘录，双方将在基金管理、能源投资等领域展开深度合作。',
      excerptZhTW: '天際控股集團與中東地區領先的主權財富基金簽署戰略合作備忘錄，雙方將在基金管理、能源投資等領域展開深度合作。',
      excerptEn: 'Skyward Holding Group signed a strategic cooperation MOU with a leading Middle Eastern sovereign wealth fund, establishing deep cooperation in fund management, energy investment, and more.',
      contentZhCN: '天际控股集团（SKYW）于2026年2月20日宣布，已与中东地区一家领先的主权财富基金正式签署战略合作备忘录。根据协议，双方将在基金管理、能源项目投资、跨境资本配置等多个领域展开全方位的深度合作。\n\n此次合作是SKYW全球化战略的重要里程碑，标志着集团在中东地区的业务布局取得实质性进展。双方将充分发挥各自优势，共同发掘亚太与中东地区的投资机会，为全球投资者创造长期可持续的投资回报。',
      contentZhTW: '天際控股集團（SKYW）於2026年2月20日宣布，已與中東地區一家領先的主權財富基金正式簽署戰略合作備忘錄。根據協議，雙方將在基金管理、能源項目投資、跨境資本配置等多個領域展開全方位的深度合作。\n\n此次合作是SKYW全球化戰略的重要里程碑，標誌著集團在中東地區的業務佈局取得實質性進展。雙方將充分發揮各自優勢，共同發掘亞太與中東地區的投資機會，為全球投資者創造長期可持續的投資回報。',
      contentEn: 'Skyward Holding Group (SKYW) announced on February 20, 2026, that it has officially signed a strategic cooperation memorandum of understanding with a leading sovereign wealth fund in the Middle East. Under the agreement, both parties will engage in comprehensive cooperation across fund management, energy project investment, cross-border capital allocation, and other areas.\n\nThis partnership marks an important milestone in SKYW\'s globalization strategy, signifying substantial progress in the Group\'s business presence in the Middle East region. Both parties will leverage their respective strengths to jointly explore investment opportunities in Asia-Pacific and the Middle East, creating long-term sustainable investment returns for global investors.',
    },
    {
      slug: 'gcoin-platform-launch',
      date: '2026-02-10',
      category: 'news',
      published: true,
      titleZhCN: 'G-COIN数字黄金平台正式上线',
      titleZhTW: 'G-COIN數字黃金平台正式上線',
      titleEn: 'G-COIN Digital Gold Platform Officially Launched',
      excerptZhCN: 'SKYW集团旗下G-COIN数字黄金平台正式上线，标志着传统黄金产业与数字金融创新深度融合的新篇章。',
      excerptZhTW: 'SKYW集團旗下G-COIN數字黃金平台正式上線，標誌著傳統黃金產業與數字金融創新深度融合的新篇章。',
      excerptEn: 'SKYW Group\'s G-COIN digital gold platform has officially launched, marking a new chapter in the deep integration of traditional gold industry with digital financial innovation.',
      contentZhCN: 'SKYW集团旗下G-COIN数字黄金平台于2026年2月10日正式上线运营。G-COIN通过区块链技术将实物黄金数字化，每一枚G-COIN均由100%实物黄金储备支撑。\n\n平台首期上线功能包括数字黄金购买、转让、赎回等核心交易功能，并与国际认证金库建立了合作关系，确保实物黄金的安全存储和全程可追溯。',
      contentZhTW: 'SKYW集團旗下G-COIN數字黃金平台於2026年2月10日正式上線運營。G-COIN通過區塊鏈技術將實物黃金數字化，每一枚G-COIN均由100%實物黃金儲備支撐。\n\n平台首期上線功能包括數字黃金購買、轉讓、贖回等核心交易功能，並與國際認證金庫建立了合作關係，確保實物黃金的安全存儲和全程可追溯。',
      contentEn: 'SKYW Group\'s G-COIN digital gold platform officially commenced operations on February 10, 2026. G-COIN digitizes physical gold through blockchain technology, with every G-COIN backed by 100% physical gold reserves.\n\nThe initial launch includes core trading functions such as digital gold purchase, transfer, and redemption, with partnerships established with internationally certified vaults to ensure secure storage and full traceability of physical gold.',
    },
    {
      slug: 'asia-pacific-market-outlook-2026',
      date: '2026-01-28',
      category: 'market',
      published: true,
      titleZhCN: '2026年亚太资本市场展望',
      titleZhTW: '2026年亞太資本市場展望',
      titleEn: '2026 Asia-Pacific Capital Market Outlook',
      excerptZhCN: 'SKYW投资研究团队发布2026年亚太资本市场展望报告，分析宏观经济趋势与投资机会。',
      excerptZhTW: 'SKYW投資研究團隊發佈2026年亞太資本市場展望報告，分析宏觀經濟趨勢與投資機會。',
      excerptEn: 'SKYW\'s investment research team releases its 2026 Asia-Pacific capital market outlook report, analyzing macroeconomic trends and investment opportunities.',
      contentZhCN: 'SKYW投资研究团队近日发布了《2026年亚太资本市场展望》报告。报告指出，在全球经济温和复苏的背景下，亚太地区将继续保持较高的增长动力。\n\n报告重点关注了以下几个投资主题：人工智能与数字化转型、清洁能源产业链、消费升级与品牌出海、以及黄金等避险资产的配置价值。SKYW建议投资者关注结构性增长机会，同时注意地缘政治风险和利率波动对投资组合的影响。',
      contentZhTW: 'SKYW投資研究團隊近日發佈了《2026年亞太資本市場展望》報告。報告指出，在全球經濟溫和復甦的背景下，亞太地區將繼續保持較高的增長動力。\n\n報告重點關注了以下幾個投資主題：人工智能與數字化轉型、清潔能源產業鏈、消費升級與品牌出海、以及黃金等避險資產的配置價值。SKYW建議投資者關注結構性增長機會，同時注意地緣政治風險和利率波動對投資組合的影響。',
      contentEn: 'SKYW\'s Investment Research team recently published its "2026 Asia-Pacific Capital Market Outlook" report. The report indicates that against the backdrop of moderate global economic recovery, the Asia-Pacific region will continue to maintain strong growth momentum.\n\nThe report focuses on several key investment themes: artificial intelligence and digital transformation, clean energy value chains, consumption upgrades and brand globalization, and the allocation value of safe-haven assets such as gold. SKYW recommends investors focus on structural growth opportunities while remaining mindful of geopolitical risks and interest rate volatility impacts on portfolios.',
    },
    {
      slug: 'clean-energy-investment-trend',
      date: '2026-01-15',
      category: 'industry',
      published: true,
      titleZhCN: '全球清洁能源投资趋势分析',
      titleZhTW: '全球清潔能源投資趨勢分析',
      titleEn: 'Global Clean Energy Investment Trend Analysis',
      excerptZhCN: '深入分析全球清洁能源领域的投资趋势，探讨能源转型带来的投资机遇与挑战。',
      excerptZhTW: '深入分析全球清潔能源領域的投資趨勢，探討能源轉型帶來的投資機遇與挑戰。',
      excerptEn: 'In-depth analysis of global clean energy investment trends, exploring opportunities and challenges presented by the energy transition.',
      contentZhCN: '全球清洁能源投资在2025年创下历史新高，预计2026年将继续保持增长态势。太阳能和风能仍是最主要的投资领域，而储能技术和氢能正在成为新的增长点。\n\nSKYW能源投资团队认为，亚太地区，特别是中国和东南亚市场，将成为全球清洁能源投资的重要增长极。集团将持续关注这些领域的投资机会，为投资者提供优质的能源资产配置方案。',
      contentZhTW: '全球清潔能源投資在2025年創下歷史新高，預計2026年將繼續保持增長態勢。太陽能和風能仍是最主要的投資領域，而儲能技術和氫能正在成為新的增長點。\n\nSKYW能源投資團隊認為，亞太地區，特別是中國和東南亞市場，將成為全球清潔能源投資的重要增長極。集團將持續關注這些領域的投資機會，為投資者提供優質的能源資產配置方案。',
      contentEn: 'Global clean energy investment reached a record high in 2025 and is expected to continue growing in 2026. Solar and wind remain the primary investment areas, while energy storage technology and hydrogen energy are emerging as new growth drivers.\n\nSKYW\'s energy investment team believes that the Asia-Pacific region, particularly the Chinese and Southeast Asian markets, will become key growth engines for global clean energy investment. The Group will continue to monitor investment opportunities in these areas, providing investors with quality energy asset allocation solutions.',
    },
  ];
  for (const a of articles) {
    await prisma.article.create({ data: a });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
