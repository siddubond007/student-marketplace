const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Find the file automatically
  const filePath = execSync('find . -name "PostJobPage.jsx" -type f').toString().trim().split('\n')[0];
  if (!filePath) throw new Error("Could not find PostJobPage.jsx");

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Setup Refs
  content = content.replace(
    /const fileInputRef = useRef\(null\);/,
    "const fileInputRef = useRef(null);\n  const descriptionRef = useRef(null);\n  const requirementsRef = useRef(null);"
  );

  // 2. Setup Auto-Resize Logic
  content = content.replace(
    /const \[formData, setFormData\] = useState\(initialFormState\);/,
    `const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (currentStep === 2) {
      setTimeout(() => {
        if (descriptionRef.current) {
          descriptionRef.current.style.height = 'auto';
          descriptionRef.current.style.height = descriptionRef.current.scrollHeight + 'px';
        }
        if (requirementsRef.current) {
          requirementsRef.current.style.height = 'auto';
          requirementsRef.current.style.height = requirementsRef.current.scrollHeight + 'px';
        }
      }, 50);
    }
  }, [currentStep, formData.description, formData.specificRequirements]);`
  );

  // 3. Transform Description Textarea
  content = content.replace(
    /<textarea\s+rows=\{7\}\s+maxLength=\{3000\}\s+value=\{formData\.description\}\s+onChange=\{\(e\) => handleFieldChange\('description', e\.target\.value\)\}\s+placeholder="Tell freelancers[^"]+"\s+className="[^"]+"\s*\/>/,
    `<textarea
                  ref={descriptionRef}
                  rows={4}
                  maxLength={3000}
                  value={formData.description}
                  onChange={(e) => {
                    handleFieldChange('description', e.target.value);
                    if (descriptionRef.current) {
                      descriptionRef.current.style.height = 'auto';
                      descriptionRef.current.style.height = descriptionRef.current.scrollHeight + 'px';
                    }
                  }}
                  placeholder="Tell freelancers what you need, what you are trying to achieve, and what the final result should look like."
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm text-white outline-none transition overflow-hidden resize-none min-h-[120px]"
                />`
  );

  // 4. Limit Deliverables Input
  content = content.replace(
    /type="text"\s+value=\{deliverable\}/g,
    `type="text"\n                        maxLength={150}\n                        value={deliverable}`
  );

  // 5. Transform Specific Requirements Textarea
  content = content.replace(
    /<div className="space-y-2">\s*<label className="block text-xs font-black uppercase tracking-wider text-slate-300">Are there any specific requirements\? <span className="text-xs text-slate-500 font-medium">\(Optional\)<\/span><\/label>\s*<textarea rows=\{4\} value=\{formData\.specificRequirements\} onChange=\{\(e\) => handleFieldChange\('specificRequirements', e\.target\.value\)\} placeholder="Describe technology requirements, technical constraints, design guidelines\.\.\." className="w-full px-4 py-3\.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500" \/>\s*<\/div>/,
    `<div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Are there any specific requirements? <span className="text-xs text-slate-500 font-medium">(Optional)</span></label>
                  <span className={\`text-[11px] font-semibold \${(formData.specificRequirements || '').length >= 300 ? 'text-red-400' : 'text-slate-500'}\`}>{(formData.specificRequirements || '').length}/300</span>
                </div>
                <textarea 
                  ref={requirementsRef}
                  rows={3} 
                  maxLength={300}
                  value={formData.specificRequirements} 
                  onChange={(e) => {
                    handleFieldChange('specificRequirements', e.target.value);
                    if (requirementsRef.current) {
                      requirementsRef.current.style.height = 'auto';
                      requirementsRef.current.style.height = requirementsRef.current.scrollHeight + 'px';
                    }
                  }} 
                  placeholder="Describe technology requirements, technical constraints, design guidelines... (Max 300 characters)" 
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500 overflow-hidden resize-none min-h-[90px]" 
                />
              </div>`
  );

  // 6. Fix Skills UI Bug
  content = content.replace(
    /<div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-56 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1">([\s\S]*?)<\/div>/,
    `<div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {filteredSkillSuggestions.map(skill => (
                        <button key={skill} type="button" onClick={() => handleAddSkill(skill)} className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-indigo-600/30 flex justify-between items-center gap-3">
                          <span className="whitespace-normal break-words">{skill}</span>
                          <Plus className="w-4 h-4 text-indigo-400 shrink-0" />
                        </button>
                      ))}
                    </div>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log("✅ Successfully patched PostJobPage.jsx");
} catch (e) {
  console.error("❌ Error patching file:", e);
}
