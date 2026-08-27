const fs = require('fs');
const path = require('path');

try {
  const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'PublicJobDetailsPage.jsx');

  if (!fs.existsSync(filePath)) {
    throw new Error("Could not find frontend/src/pages/PublicJobDetailsPage.jsx. Make sure you run this from the root directory.");
  }

  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Add missing lucide-react icons for the attachments
  if (!code.includes('ExternalLink')) {
    code = code.replace(
      /import \{ ArrowLeft, Wallet, User, Users, CheckCircle2, Calendar, LayoutTemplate \} from 'lucide-react';/,
      "import { ArrowLeft, Wallet, User, Users, CheckCircle2, Calendar, LayoutTemplate, Paperclip, ExternalLink, Globe } from 'lucide-react';"
    );
  }

  // 2. Inject the Attachments & References UI just before the bid form
  const attachmentsUI = `
          {/* Attachments & References */}
          {(job.attachmentUrls?.length > 0 || job.externalLinks?.length > 0 || job.referenceLinks?.length > 0) && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl mt-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Paperclip className="text-emerald-400" size={20} /> Attachments & References
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {job.attachmentUrls?.map((url, i) => {
                  const fileName = url.split('/').pop().split('?')[0] || \`Attachment \${i + 1}\`;
                  return (
                    <a key={\`att-\${i}\`} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all group">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Paperclip size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-gray-200 truncate">{decodeURIComponent(fileName)}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Click to view/download</div>
                      </div>
                    </a>
                  );
                })}
                
                {job.externalLinks?.map((url, i) => (
                  <a key={\`ext-\${i}\`} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all group">
                    <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                      <ExternalLink size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-200 truncate">{url}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Cloud Drive Link</div>
                    </div>
                  </a>
                ))}

                {job.referenceLinks?.map((url, i) => (
                  <a key={\`ref-\${i}\`} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 hover:border-purple-500/30 rounded-2xl transition-all group">
                    <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                      <Globe size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-200 truncate">{url}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Reference Website</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Place a Bid Form Section */}`;

  // Prevent double injection if the script is run twice
  if (!code.includes('Attachments & References')) {
    code = code.replace(/\{\/\*\s*Place a Bid Form Section\s*\*\/\}/, attachmentsUI.trim());
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("✅ Successfully patched PublicJobDetailsPage.jsx with Attachments section!");
  } else {
    console.log("⚠️ Attachments section already exists in PublicJobDetailsPage.jsx. Skipping.");
  }
} catch (e) {
  console.error("❌ Patch failed:", e);
}
