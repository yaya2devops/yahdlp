#!/usr/bin/env node
const fs = require('fs');
const yargs = require('yargs');
const { createWorker } = require('tesseract.js');
const sharp = require('sharp');
const path = require('path');

process.removeAllListeners('warning');

const TEMP_FILE = path.join(process.cwd(), '.yahdlp-temp.json');

const COLORS = {
  found: { r: 100, g: 100, b: 200, alpha: 1 },      // Light purple, opaque for found
  notFound: { r: 64, g: 64, b: 153, alpha: 0.7 },   // Darker purple, semi-transparent
  textBg: { r: 0, g: 0, b: 0, alpha: 0.7 }          // Text background
};

const patterns = {
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
  PHONE: /(?:\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}\b/
};

function saveInspectedValues(values) {
  fs.writeFileSync(TEMP_FILE, JSON.stringify(values));
}

function getInspectedValues() {
  try {
    return JSON.parse(fs.readFileSync(TEMP_FILE));
  } catch {
    return { EMAIL: null, PHONE: null };
  }
}

async function inspectText(text, types = ['EMAIL', 'PHONE']) {
  const findings = [];
  const values = { EMAIL: null, PHONE: null };
  
  types.forEach(type => {
    const pattern = patterns[type];
    const matches = text.match(pattern) || [];
    if (matches.length > 0) {
      values[type] = matches[0].toLowerCase();
      findings.push({ type, value: matches[0] });
    }
  });
  
  saveInspectedValues(values);
  return findings;
}

async function matchesInspectedValue(text, type) {
  const values = getInspectedValues();
  if (!values[type]) return false;
  
  const pattern = patterns[type];
  const matches = text.match(pattern) || [];
  return matches.some(match => match.toLowerCase() === values[type]);
}

async function redactImage(inputPath, outputPath, types) {
  try {
    const worker = await createWorker();
    const { data } = await worker.recognize(inputPath);
    
    let hasMatch = false;
    for (const type of types) {
      if (await matchesInspectedValue(data.text, type)) {
        hasMatch = true;
        break;
      }
    }

    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const colors = hasMatch ? COLORS.found : COLORS.notFound;

    await image
      .composite([{
        input: {
          create: {
            width: metadata.width,
            height: metadata.height,
            channels: 4,
            background: colors
          }
        },
        top: 0,
        left: 0
      }, {
        input: Buffer.from(`
          <svg width="${metadata.width}" height="${metadata.height}">
            <style>
              .message-container {
                font-family: Arial;
                font-weight: bold;
              }
              .title { 
                fill: white; 
                font-size: 38px;
              }
              .subtitle { 
                fill: white; 
                font-size: 28px;
              }
            </style>
            <g class="message-container">
              ${hasMatch ? `
                <text x="50%" y="45%" class="title" text-anchor="middle">
                  The asset has been thoroughly processed and redacted.
                </text>
                <text x="50%" y="55%" class="subtitle" text-anchor="middle">
                  As an inclusion of PIIs are detected by yahSystems.
                </text>
              ` : `
                <text x="50%" y="50%" class="title" text-anchor="middle">
                  Inspected PII not found in this asset
                </text>
              `}
            </g>
          </svg>
        `),
        top: 0,
        left: 0
      }])
      .toFile(outputPath);

    if (fs.existsSync('eng.traineddata')) fs.unlinkSync('eng.traineddata');
    console.log(hasMatch ? 'Found and redacted PII' : 'No matching PII found');
    await worker.terminate();
  } catch (error) {
    console.error('Error:', error);
  }
}

yargs
  .usage('\nUsage: $0 <command> [options]')
  .command('inspect', 'Inspect text for PII', {
    text: {
      alias: 't',
      describe: 'Text to inspect',
      demandOption: true
    },
    email: {
      alias: 'e',
      type: 'boolean',
      describe: 'Inspect for email'
    },
    phone: {
      alias: 'p',
      type: 'boolean',
      describe: 'Inspect for phone'
    }
  }, async (argv) => {
    const types = [];
    if (argv.email) types.push('EMAIL');
    if (argv.phone) types.push('PHONE');
    if (types.length === 0) types.push('EMAIL', 'PHONE');
    
    const findings = await inspectText(argv.text, types);
    console.log(JSON.stringify(findings, null, 2));
  })
  .command('redact <input> <output>', 'Redact PII from image', {
    email: {
      alias: 'e',
      type: 'boolean',
      describe: 'Redact email'
    },
    phone: {
      alias: 'p',
      type: 'boolean',
      describe: 'Redact phone'
    }
  }, async (argv) => {
    const values = getInspectedValues();
    if (!values.EMAIL && !values.PHONE) {
      console.error('Please run inspect command first');
      return;
    }
    
    const types = [];
    if (argv.email) types.push('EMAIL');
    if (argv.phone) types.push('PHONE');
    if (types.length === 0) types.push('EMAIL', 'PHONE');
    
    await redactImage(argv.input, argv.output, types);
  })
  .demandCommand()
  .help()
  .argv;