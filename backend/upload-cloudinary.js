const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: 'ddn1qjenm',
  api_key: '575288439725552',
  api_secret: 'CtskPK01ozeub70dihNjFAVvmPE',
});

const BASE_DIR = path.join(__dirname, '..', 'frontend', 'public', 'images');
const FOLDERS = ['bases', 'sauces', 'cheese', 'veggies', 'meat'];

async function uploadAll() {
  const results = {};

  for (const folder of FOLDERS) {
    const folderPath = path.join(BASE_DIR, folder);
    if (!fs.existsSync(folderPath)) {
      console.log(`Skipping ${folder} - directory not found`);
      continue;
    }

    const files = fs.readdirSync(folderPath).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
    results[folder] = {};

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const publicId = `pizzonex/builder/${folder}/${path.parse(file).name}`;

      try {
        const res = await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          overwrite: true,
          resource_type: 'image',
        });
        results[folder][path.parse(file).name] = res.secure_url;
        console.log(`✅ Uploaded: ${publicId} -> ${res.secure_url}`);
      } catch (err) {
        console.error(`❌ Failed: ${publicId} - ${err.message}`);
      }
    }
  }

  // Write URL mapping for reference
  const outputPath = path.join(__dirname, 'cloudinary-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 URL mapping saved to: ${outputPath}`);
}

uploadAll().catch(console.error);
