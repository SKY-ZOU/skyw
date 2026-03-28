import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('../src/app/generated/prisma/index.js');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables manually from .env and .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function loadEnv() {
  const envFiles = ['.env', '.env.local'];
  envFiles.forEach(file => {
    const filePath = path.resolve(rootDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          process.env[key] = value;
        }
      });
    }
  });
}

loadEnv();

function getPrisma() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    console.log('🌐 Connecting to Turso Database...');
    const { PrismaLibSql: PrismaLibSqlWeb } = require('@prisma/adapter-libsql/web');
    const adapter = new PrismaLibSqlWeb({ url: tursoUrl, authToken });
    return new PrismaClient({ adapter });
  }

  console.log('🏠 Connecting to Local SQLite (dev.db)...');
  const dbUrl = 'file:' + path.resolve(rootDir, 'dev.db');
  const adapter = new PrismaLibSql({ url: dbUrl });
  return new PrismaClient({ adapter });
}

const prisma = getPrisma();

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide a path to the news JSON file.');
    process.exit(1);
  }

  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(absolutePath, 'utf8');
  const data = JSON.parse(rawData);
  const articles = Array.isArray(data) ? data : [data];

  for (const item of articles) {
    try {
      const article = await prisma.article.upsert({
        where: { slug: item.slug },
        update: {
          category: item.category || 'news',
          date: item.date || new Date().toISOString().split('T')[0],
          coverImage: item.coverImage || '',
          titleZhCN: item.titleZhCN,
          titleZhTW: item.titleZhTW,
          titleEn: item.titleEn,
          excerptZhCN: item.excerptZhCN,
          excerptZhTW: item.excerptZhTW,
          excerptEn: item.excerptEn,
          contentZhCN: item.contentZhCN,
          contentZhTW: item.contentZhTW,
          contentEn: item.contentEn,
          keywords: item.keywords || '',
          featured: item.featured || false,
          published: true,
        },
        create: {
          slug: item.slug,
          category: item.category || 'news',
          date: item.date || new Date().toISOString().split('T')[0],
          coverImage: item.coverImage || '',
          titleZhCN: item.titleZhCN,
          titleZhTW: item.titleZhTW,
          titleEn: item.titleEn,
          excerptZhCN: item.excerptZhCN,
          excerptZhTW: item.excerptZhTW,
          excerptEn: item.excerptEn,
          contentZhCN: item.contentZhCN,
          contentZhTW: item.contentZhTW,
          contentEn: item.contentEn,
          keywords: item.keywords || '',
          featured: item.featured || false,
          published: true,
        },
      });

      console.log(`\n✅ Processed article: ${article.slug}`);
    } catch (error) {
      console.error(`\n❌ Error processing ${item.slug}:`, error);
    }
  }

  await prisma.$disconnect();
}

main();
