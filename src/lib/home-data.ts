export const CN_NUM = ['壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖', '拾'] as const;

export interface Bilingual {
  zh: string;
  en: string;
}

export interface Partner {
  name: Bilingual;
  role: Bilingual;
  badge: string;
  stats: { v: string; l: string }[];
  highlight: Bilingual;
  accent: string;
}

export const PARTNERS: Partner[] = [
  {
    name: { zh: '恒邦资本', en: 'Hengbang Capital' },
    role: { zh: '中国内地股东', en: 'Mainland China Shareholder' },
    badge: 'AMAC P1067569',
    stats: [
      { v: '¥60B+', l: 'AUM' },
      { v: '70+', l: 'Portfolio' },
      { v: '2017', l: 'Est.' },
    ],
    highlight: { zh: '中科院国科创新 + 华润资本', en: 'CAS Innovation + China Resources Capital' },
    accent: '#C89B3A',
  },
  {
    name: { zh: 'AKJ 集团', en: 'AK Jensen Group' },
    role: { zh: '欧洲对冲基金伙伴', en: 'European Hedge Fund Partner' },
    badge: 'FCA · Norway · Malta',
    stats: [
      { v: '$24B+', l: 'AUM' },
      { v: '35', l: 'Countries' },
      { v: '1995', l: 'Est.' },
    ],
    highlight: { zh: '伦敦 · 挪威 · 马耳他三地监管', en: 'London · Norway · Malta Regulated' },
    accent: '#8B9DC3',
  },
  {
    name: { zh: '中银资管(新加坡)', en: 'BOCAM Singapore' },
    role: { zh: '基金管理伙伴', en: 'Fund Management Partner' },
    badge: 'MAS RLFMC · QFII · CIBM',
    stats: [
      { v: '¥745B+', l: 'BOC AUM' },
      { v: '300+', l: 'Clients' },
      { v: 'MAS', l: 'Licensed' },
    ],
    highlight: { zh: '中国银行 83.5% + 贝莱德 16.5%', en: 'Bank of China 83.5% + BlackRock 16.5%' },
    accent: '#C14852',
  },
];

export interface Fund {
  plat: string;
  platZh: string;
  name: string;
  code: string;
  license: string;
  size: string;
  accent: string;
  detail: Bilingual;
}

export const FUNDS: Fund[] = [
  {
    plat: 'Hong Kong OFC',
    platZh: '香港开放式基金公司',
    name: 'Eminence Global Master Fund',
    code: 'BUB855 / BWH896',
    license: 'SFC Type 9 · BOP785',
    size: 'AUM ~USD 1B',
    accent: '#C89B3A',
    detail: {
      zh: '多策略:基石 · 锚定 · 大宗 · 并购',
      en: 'Multi-strategy: cornerstone, anchor, block, M&A',
    },
  },
  {
    plat: 'Singapore VCC',
    platZh: '新加坡可变动资本公司',
    name: 'BOCAM-GBA International Select Fund',
    code: '中银-大湾区国际精选投资基金',
    license: 'MAS RLFMC · QFII · CIBM',
    size: 'Target HKD 5B',
    accent: '#C14852',
    detail: {
      zh: '目标HKD 5B · 首期HKD 500M · 港股 · 美股 · A股',
      en: 'Target HKD 5B · First close 500M · HK / US / China A',
    },
  },
  {
    plat: 'Shenzhen QFLP',
    platZh: '深圳前海合格境外有限合伙人',
    name: 'Shenzhen-HK Global Tech Innovation Fund',
    code: '深港全球科技创新发展基金',
    license: 'AMAC P1067569',
    size: 'Total HKD 500M',
    accent: '#3B82F6',
    detail: {
      zh: 'AI · 生物科技 · 跨境电商 · 区块链',
      en: 'AI · biotech · cross-border e-com · blockchain',
    },
  },
];

export interface Portfolio {
  zh: string;
  en: string;
  sector: 'ai' | 'robotics' | 'health' | 'consumer' | 'industrial';
  ex: string;
}

export const PORTFOLIO: Portfolio[] = [
  // 2024–2025 年近期港股上市 / 基石 · 锚定案例
  { zh: '地平线机器人', en: 'Horizon Robotics',   sector: 'ai',         ex: '9660.HK' },  // 2024-10
  { zh: '黑芝麻智能',   en: 'Black Sesame Intl.', sector: 'ai',         ex: '2533.HK' },  // 2024-08
  { zh: '晶科电子',     en: 'JKIC',               sector: 'ai',         ex: '2551.HK' },  // 2024-06
  { zh: '北京赛目',     en: 'Saimo Tech',         sector: 'ai',         ex: '2571.HK' },  // 2024
  { zh: '优必选',       en: 'UBTECH',             sector: 'robotics',   ex: '9880.HK' },  // 2023-12
  { zh: '越疆科技',     en: 'Dobot',              sector: 'robotics',   ex: '2432.HK' },  // 2024-12
  { zh: '微创机器人',   en: 'MicroPort Surgical', sector: 'robotics',   ex: '2252.HK' },
  { zh: '晶泰科技',     en: 'XtalPi',             sector: 'health',     ex: '2228.HK' },  // 2024-06
  { zh: '乐普生物',     en: 'Lupu Bio',           sector: 'health',     ex: '2157.HK' },
  { zh: '百利天恒',     en: 'Baiily Biopharma',   sector: 'health',     ex: '688506.SH' },
  { zh: '蜜雪冰城',     en: 'MIXUE',              sector: 'consumer',   ex: '2097.HK' },  // 2025-03
  { zh: '古茗',         en: 'Guming',             sector: 'consumer',   ex: '1364.HK' },  // 2025-02
  { zh: '老铺黄金',     en: 'Lao Pu Gold',        sector: 'consumer',   ex: '6181.HK' },  // 2024-06
  { zh: '梦金园',       en: 'Mengjin Gold',       sector: 'consumer',   ex: '2585.HK' },  // 2025-01
  { zh: '霸王茶姬',     en: 'Chagee',             sector: 'consumer',   ex: 'CHA.US' },   // 2025-04
  { zh: '顺丰控股',     en: 'SF Holding',         sector: 'industrial', ex: '6936.HK' },  // 2024-11
  { zh: '美的集团',     en: 'Midea Group',        sector: 'industrial', ex: '0300.HK' },  // 2024-09
  { zh: '宁德时代',     en: 'CATL',               sector: 'industrial', ex: '3750.HK' },  // 2025-05
  { zh: '安徽海螺',     en: 'Conch Materials',    sector: 'industrial', ex: '2560.HK' },
  { zh: '升辉清洁',     en: 'Shenhui Clean',      sector: 'industrial', ex: '2521.HK' },
];

export type Sector = Portfolio['sector'];

export const SECTOR_LABELS: Record<Sector, Bilingual> = {
  ai: { zh: 'AI 与半导体', en: 'AI & Semi' },
  robotics: { zh: '机器人', en: 'Robotics' },
  health: { zh: '生物医疗', en: 'Biotech & Health' },
  consumer: { zh: '新消费', en: 'Consumer' },
  industrial: { zh: '先进制造', en: 'Industrial' },
};

export const SECTOR_STYLES: Record<Sector, { bg: string; text: string; border: string }> = {
  ai: { bg: '#fff6db', text: '#8a5a00', border: '#e6c27a' },
  robotics: { bg: '#e7edfb', text: '#1a356e', border: '#9bb1d9' },
  health: { bg: '#e7f3e9', text: '#205d29', border: '#a3c9a9' },
  consumer: { bg: '#f1e7f5', text: '#5a1e68', border: '#c6a1ce' },
  industrial: { bg: '#faeadb', text: '#7a3a12', border: '#deb28a' },
};

export interface Corridor {
  key: string;
  city: string;
  region: Bilingual;
  description: Bilingual;
  x: number;
  y: number;
  details: [string, string, string];
}

export const CORRIDOR_HQ = { x: 81, y: 31 }; // Hong Kong

export const CORRIDORS: Corridor[] = [
  {
    key: 'dubai',
    city: 'Dubai',
    region: { zh: '海湾与中东', en: 'GCC · Middle East' },
    description: {
      zh: '迪拜办公室服务GCC主权基金、家族办公室及机构投资人,聚焦黄金、能源及多策略基金。',
      en: 'Serving GCC sovereign wealth, family offices and institutions — gold, energy and multi-strategy funds.',
    },
    x: 34,
    y: 30,
    details: ['Sovereign · FO', 'Gold · Energy', 'DFSA'],
  },
  {
    key: 'singapore',
    city: 'Singapore',
    region: { zh: '东盟与东南亚', en: 'ASEAN Hub' },
    description: {
      zh: '新加坡枢纽连接东南亚机构投资人,提供港股IPO机会、人民币固定收益及跨境结构性产品。',
      en: 'Singapore hub for ASEAN institutions — HK IPOs, RMB fixed income and cross-border structured products.',
    },
    x: 72,
    y: 44,
    details: ['Family Office', 'HK IPO · RMB FI', 'MAS'],
  },
  {
    key: 'shenzhen',
    city: 'Shenzhen',
    region: { zh: '大湾区', en: 'Greater Bay Area' },
    description: {
      zh: '深圳运营中心通过QFLP、QDIE及共同投资,将内地机构资本与离岸香港架构高效对接。',
      en: 'Onshore hub bridging Mainland institutional capital with offshore HK structures via QFLP/QDIE.',
    },
    x: 79,
    y: 27,
    details: ['Onshore Inst.', 'QFLP · QDIE', 'CSRC'],
  },
  {
    key: 'southAsia',
    city: 'South Asia',
    region: { zh: '中亚与南亚', en: 'Central & South Asia' },
    description: {
      zh: '专门服务巴基斯坦、孟加拉国、中亚及更广泛一带一路走廊的主权及机构投资人。',
      en: 'Dedicated coverage of Pakistan, Bangladesh, Central Asia sovereigns and B&R corridor LPs.',
    },
    x: 48,
    y: 32,
    details: ['Sovereign', 'Infrastructure', 'Local CB'],
  },
  {
    key: 'london',
    city: 'London',
    region: { zh: '欧洲与英国', en: 'Europe · UK' },
    description: {
      zh: '伦敦办公室支持欧洲家族办公室及机构客户,提供受监管的亚太及中国资产配置方案。',
      en: 'European FOs and institutions — regulated HK-domiciled APAC/China allocations.',
    },
    x: 10,
    y: 12,
    details: ['Institutional', 'China Allocation', 'FCA'],
  },
];

export interface RegulatoryMilestone {
  year: string;
  cn: string;
  title: string;
  desc: Bilingual;
}

export const REGULATORY_TIMELINE: RegulatoryMilestone[] = [
  {
    year: '2018',
    cn: '壹',
    title: 'SFC Type 6',
    desc: { zh: '就机构融资提供意见 · BBM628', en: 'Corporate Finance Advisory · BBM628' },
  },
  {
    year: '2020',
    cn: '貳',
    title: 'SFC Type 9',
    desc: { zh: '资产管理 · BOP785 · ~$1B AUM', en: 'Asset Management · BOP785 · ~$1B AUM' },
  },
  {
    year: '2022',
    cn: '參',
    title: 'AMAC P1067569',
    desc: { zh: '中基协私募基金管理人备案', en: 'China Private Fund Manager Filing' },
  },
  {
    year: '2024',
    cn: '肆',
    title: 'MAS RLFMC + FCA',
    desc: { zh: '通过 BOCAM 与 AKJ 联动', en: 'via BOCAM Singapore & AKJ Group' },
  },
];

export interface TrackStat {
  v: string;
  l: Bilingual;
  cn: string;
}

export const TRACK_STATS: TrackStat[] = [
  { v: '30+', l: { zh: '基石 / 锚定', en: 'Cornerstone / Anchor' }, cn: '卅' },
  { v: 'HKD 15B+', l: { zh: '累计募资', en: 'Cumulative Raise' }, cn: '拾伍' },
  { v: '5', l: { zh: '行业赛道', en: 'Core Sectors' }, cn: '伍' },
  { v: '2021–', l: { zh: '活跃年份', en: 'Active Since' }, cn: '貳' },
];

// ─── Institutional Architecture (合并版:股东/伙伴 × 平台) ───
export type RelationshipKind = 'shareholder' | 'partner';

export interface InstitutionalUnit {
  cn: string;
  hubCn: string;
  hubEn: string;
  /** Relationship to SKYW — shareholder = 股东/自持, partner = 战略伙伴/基金合作伙伴 */
  relationship: RelationshipKind;
  relationshipLabel: Bilingual;
  owner: Bilingual;
  ownerBadge: string;
  ownerHighlight: Bilingual;
  ownerStats: { v: string; l: string }[];
  platformCn: string;
  platformEn: string;
  platformLicense: string;
  fundName: string;
  fundCode: string;
  fundSize: string;
  fundDetail: Bilingual;
  accent: string;
}

export const INSTITUTIONAL_UNITS: InstitutionalUnit[] = [
  {
    cn: '壹',
    hubCn: '香港',
    hubEn: 'Hong Kong',
    relationship: 'shareholder',
    relationshipLabel: { zh: '自持 · 持牌主體', en: 'Self-Operated · Licensed Principal' },
    owner: { zh: 'SKYW 天汇基金', en: 'SKYW Group' },
    ownerBadge: 'SFC Type 6 · BBM628 + Type 9 · BOP785',
    ownerHighlight: {
      zh: '香港總部 · 證監會持牌資產管理人',
      en: 'Hong Kong HQ · SFC-licensed asset manager',
    },
    ownerStats: [
      { v: '$1B+', l: 'AUM' },
      { v: '6+', l: 'Strategies' },
      { v: '2018', l: 'Est.' },
    ],
    platformCn: '香港開放式基金公司',
    platformEn: 'Hong Kong OFC',
    platformLicense: 'SFC Type 9 · BOP785',
    fundName: 'Eminence Global Master Fund',
    fundCode: 'BUB855 / BWH896',
    fundSize: '~USD 1B AUM',
    fundDetail: {
      zh: '多策略:基石 · 錨定 · 大宗 · 併購',
      en: 'Multi-strategy: cornerstone, anchor, block, M&A',
    },
    accent: '#C89B3A',
  },
  {
    cn: '貳',
    hubCn: '新加坡',
    hubEn: 'Singapore',
    relationship: 'partner',
    relationshipLabel: { zh: '基金合作夥伴', en: 'Fund Partner' },
    owner: { zh: '中銀資管(新加坡) BOCAM', en: 'BOCAM Singapore' },
    ownerBadge: 'MAS RLFMC · QFII · CIBM',
    ownerHighlight: {
      zh: '中國銀行 83.5% + 貝萊德 16.5%',
      en: 'Bank of China 83.5% + BlackRock 16.5%',
    },
    ownerStats: [
      { v: '¥745B+', l: 'BOC AUM' },
      { v: '300+', l: 'Clients' },
      { v: 'MAS', l: 'Licensed' },
    ],
    platformCn: '新加坡可變動資本公司',
    platformEn: 'Singapore VCC',
    platformLicense: 'MAS RLFMC · QFII · CIBM',
    fundName: 'BOCAM-GBA International Select Fund',
    fundCode: '中銀-大灣區國際精選投資基金',
    fundSize: 'Target HKD 5B',
    fundDetail: {
      zh: '目標 HKD 5B · 首期 500M · 港美中股',
      en: 'Target HKD 5B · First 500M · HK / US / China A',
    },
    accent: '#C14852',
  },
  {
    cn: '參',
    hubCn: '深圳前海',
    hubEn: 'Shenzhen Qianhai',
    relationship: 'shareholder',
    relationshipLabel: { zh: '內地股東', en: 'Mainland Shareholder' },
    owner: { zh: '恒邦資本 Hengbang', en: 'Hengbang Capital' },
    ownerBadge: 'AMAC P1067569',
    ownerHighlight: {
      zh: '中科院國科創新 + 華潤資本',
      en: 'CAS Innovation + China Resources Capital',
    },
    ownerStats: [
      { v: '¥60B+', l: 'AUM' },
      { v: '70+', l: 'Portfolio' },
      { v: '2017', l: 'Est.' },
    ],
    platformCn: '深圳前海合格境外有限合夥人',
    platformEn: 'Shenzhen QFLP',
    platformLicense: 'AMAC P1067569',
    fundName: 'Shenzhen-HK Global Tech Innovation Fund',
    fundCode: '深港全球科技創新發展基金',
    fundSize: 'Total HKD 500M',
    fundDetail: {
      zh: 'AI · 生物科技 · 跨境電商 · 區塊鏈',
      en: 'AI · biotech · cross-border e-com · blockchain',
    },
    accent: '#3B82F6',
  },
];

// AKJ — 欧洲分销合作伙伴(不对应国内平台,独立以分销身份存在)
export const EUROPEAN_DISTRIBUTION = {
  cn: '肆',
  name: { zh: 'AKJ 集團', en: 'AK Jensen Group' },
  role: { zh: '歐洲分銷夥伴 · 對沖基金', en: 'European Distribution · Hedge Fund' },
  badge: 'FCA · Norway · Malta',
  highlight: {
    zh: '倫敦 · 挪威 · 馬耳他 三地監管',
    en: 'London · Norway · Malta Regulated',
  },
  stats: [
    { v: '$24B+', l: 'AUM' },
    { v: '35', l: 'Countries' },
    { v: '1995', l: 'Est.' },
  ],
  accent: '#8B9DC3',
} as const;

// Hero ticker mock data (refreshed each frame via UI state; values are seed)
export const HERO_TICKER = {
  indices: [
    { label: 'HSI', value: '19,847.23', delta: '+0.84%' },
    { label: 'USD/HKD', value: '7.7812', delta: '' },
    { label: 'XAU/USD', value: '2,418.50', delta: '+0.32%' },
  ],
};
