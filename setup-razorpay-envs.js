const fs = require('fs');
const path = require('path');

const updateEnvFile = (filePath, keys) => {
    let content = '';
    if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, 'utf8');
    }
    
    for (const [key, value] of Object.entries(keys)) {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (content.match(regex)) {
            content = content.replace(regex, `${key}="${value}"`);
        } else {
            content += `\n${key}="${value}"`;
        }
    }
    
    fs.writeFileSync(filePath, content.trim() + '\n');
    console.log(`✅ Safely updated ${filePath}`);
};

updateEnvFile('backend/.env', {
    RAZORPAY_KEY_ID: process.env.RZP_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RZP_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RZP_WEBHOOK_SECRET
});

updateEnvFile('frontend/.env', {
    VITE_RAZORPAY_KEY_ID: process.env.RZP_KEY_ID
});
