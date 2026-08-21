import os

# 1. Update backend/prisma/schema.prisma
schema_path = os.path.expanduser('~/student-marketplace/backend/prisma/schema.prisma')
with open(schema_path, 'r') as f:
    schema_content = f.read()

if 'collegeIdStatus' not in schema_content:
    schema_content = schema_content.replace(
        "  idCardUrl              String?\n  certificateUrl         String?\n  nationalIdUrl          String?",
        "  idCardUrl              String?\n  collegeIdStatus        VerificationStatus @default(PENDING)\n  collegeRejectionReason String?\n  certificateUrl         String?\n  nationalIdUrl          String?\n  govtIdStatus           VerificationStatus @default(PENDING)\n  govtRejectionReason    String?"
    )
    with open(schema_path, 'w') as f:
        f.write(schema_content)
    print('✅ Updated schema.prisma')

# 2. Update backend/src/controllers/userController.js
user_controller_path = os.path.expanduser('~/student-marketplace/backend/src/controllers/userController.js')
with open(user_controller_path, 'r') as f:
    uc = f.read()

submit_code = """exports.submitVerification = async (req, res) => {
  try {
    const { idCardUrl, collegeName, educationType, nationalIdUrl } = req.body;
    if (!idCardUrl && !nationalIdUrl) {
      return res.status(400).json({ error: 'Please upload either your College Student ID or Government ID document.' });
    }

    const updateData = {
      reviewedAt: null
    };

    if (idCardUrl) {
      updateData.idCardUrl = idCardUrl;
      updateData.collegeIdStatus = 'PENDING';
      updateData.collegeRejectionReason = null;
    }
    if (nationalIdUrl) {
      updateData.nationalIdUrl = nationalIdUrl;
      updateData.govtIdStatus = 'PENDING';
      updateData.govtRejectionReason = null;
    }
    if (collegeName) updateData.collegeName = collegeName;
    if (educationType) updateData.educationType = educationType;

    const verification = await prisma.verificationRequest.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        idCardUrl: idCardUrl || null,
        collegeIdStatus: idCardUrl ? 'PENDING' : 'PENDING',
        nationalIdUrl: nationalIdUrl || null,
        govtIdStatus: nationalIdUrl ? 'PENDING' : 'PENDING',
        collegeName: collegeName || '',
        educationType: educationType || 'COLLEGE',
        status: 'PENDING'
      },
      update: updateData
    });

    res.status(201).json({ message: 'Verification document submitted successfully for review.', verification });
  } catch (err) {
    console.error('Submit verification error:', err);
    res.status(500).json({ error: err.message });
  }
};
"""

if 'exports.submitVerification =' in uc:
    uc = uc.split('exports.submitVerification =')[0] + submit_code
    with open(user_controller_path, 'w') as f:
        f.write(uc)
    print('✅ Updated userController.js')

# 3. Update backend/src/controllers/adminController.js
admin_controller_path = os.path.expanduser('~/student-marketplace/backend/src/controllers/adminController.js')
with open(admin_controller_path, 'r') as f:
    ac = f.read()

admin_update_code = """exports.updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, status, reason } = req.body; // type: 'COLLEGE' | 'GOVT'
    
    const dataToUpdate = {
      reviewedAt: new Date()
    };

    if (type === 'COLLEGE') {
      dataToUpdate.collegeIdStatus = status;
      dataToUpdate.collegeRejectionReason = status === 'REJECTED' ? (reason || 'College ID document was unreadable or rejected.') : null;
    } else if (type === 'GOVT') {
      dataToUpdate.govtIdStatus = status;
      dataToUpdate.govtRejectionReason = status === 'REJECTED' ? (reason || 'Government ID document was unreadable or rejected.') : null;
    } else {
      dataToUpdate.status = status;
      dataToUpdate.collegeIdStatus = status;
      dataToUpdate.govtIdStatus = status;
    }

    const verification = await prisma.verificationRequest.update({
      where: { id },
      data: dataToUpdate
    });
    
    res.json({ message: `Verification for ${type || 'All'} updated to ${status}`, verification });
  } catch (err) {
    console.error('updateVerificationStatus error:', err);
    res.status(500).json({ error: err.message });
  }
};
"""

if 'exports.updateVerificationStatus =' in ac:
    ac = ac.split('exports.updateVerificationStatus =')[0] + admin_update_code
    with open(admin_controller_path, 'w') as f:
        f.write(ac)
    print('✅ Updated adminController.js')

# 4. Update frontend/src/pages/UserProfilePage.jsx
user_profile_path = os.path.expanduser('~/student-marketplace/frontend/src/pages/UserProfilePage.jsx')
with open(user_profile_path, 'r') as f:
    up = f.read()

sidebar_search_start = "            <h4 className=\"text-xs font-black uppercase tracking-wider text-slate-400\">Verifications</h4>"
sidebar_search_end = "            <h4 className=\"text-xs font-black uppercase tracking-wider text-slate-400\">Performance Metrics</h4>"

if sidebar_search_start in up and sidebar_search_end in up:
    before = up.split(sidebar_search_start)[0]
    after = up.split(sidebar_search_end)
    
    new_sidebar = """            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Verifications</h4>
            <div className="space-y-3 text-sm text-slate-300">
              {/* 1. College Student ID Verification */}
              {profileUser.verification?.collegeIdStatus === 'APPROVED' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <Check className="w-5 h-5" />
                    <span>College Student ID</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-md border border-emerald-500/30">Verified</span>
                </div>
              ) : profileUser.verification?.collegeIdStatus === 'PENDING' && profileUser.verification?.idCardUrl ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <Clock className="w-5 h-5 animate-pulse" />
                    <span>College Student ID</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-md border border-amber-500/30">Under Review</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <ShieldAlert className="w-5 h-5 text-slate-500" />
                    <span>College Student ID</span>
                  </div>
                  {isOwner && (
                    <button 
                      onClick={() => { setVerificationModalType('college_id'); setShowVerificationModal(true); }} 
                      className="text-xs px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition shadow-md flex items-center space-x-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Verify College ID</span>
                    </button>
                  )}
                </div>
              )}

              {/* 2. Government Identity Verification */}
              {profileUser.verification?.govtIdStatus === 'APPROVED' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <Check className="w-5 h-5" />
                    <span>Identity Verified</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-md border border-emerald-500/30">Verified</span>
                </div>
              ) : profileUser.verification?.govtIdStatus === 'PENDING' && profileUser.verification?.nationalIdUrl ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <Clock className="w-5 h-5 animate-pulse" />
                    <span>Identity Verified</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-md border border-amber-500/30">Under Review</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <ShieldAlert className="w-5 h-5 text-slate-500" />
                    <span>Identity Verified</span>
                  </div>
                  {isOwner && (
                    <button 
                      onClick={() => { setVerificationModalType('govt_id'); setShowVerificationModal(true); }} 
                      className="text-xs px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg transition shadow-md flex items-center space-x-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Verify Govt ID</span>
                    </button>
                  )}
                </div>
              )}

              {/* 3. Email Verified */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Check className="w-5 h-5" />
                  <span>Email Verified</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-md border border-emerald-500/30">Verified</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
"""
    up = before + new_sidebar + sidebar_search_end + after
    with open(user_profile_path, 'w') as f:
        f.write(up)
    print('✅ UserProfilePage.jsx updated with independent verification badges!')

# 5. Update frontend/src/pages/AdminDashboard.jsx
admin_path = os.path.expanduser('~/student-marketplace/frontend/src/pages/AdminDashboard.jsx')
with open(admin_path, 'r') as f:
    ad = f.read()

handlers_marker_start = "  // Delete User Action"
handlers_marker_end = "  const handleDeleteUser = async (userId, userName) => {"

new_admin_handlers = """  // Document Verification Actions (Independent College ID & Govt ID)
  const handleApproveVerification = async (id, docType) => {
    try {
      await API.put(`/admin/verifications/${id}/status`, { type: docType, status: 'APPROVED' });
      confetti();
      alert(`✅ ${docType === 'COLLEGE' ? 'College Student ID' : 'Government Identity ID'} Approved!`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to approve: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleRejectVerification = async (id, docType) => {
    const reason = window.prompt(`Enter rejection reason for ${docType === 'COLLEGE' ? 'College ID' : 'Govt ID'} (optional):`, 'Document image was blurry or unreadable.');
    if (reason === null) return;
    try {
      await API.put(`/admin/verifications/${id}/status`, { type: docType, status: 'REJECTED', reason });
      alert(`❌ ${docType === 'COLLEGE' ? 'College ID' : 'Govt ID'} marked as Rejected.`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to reject: ' + (err.response?.data?.error || err.message));
    }
  };
"""

if handlers_marker_start in ad and handlers_marker_end in ad:
    before_h = ad.split(handlers_marker_start)[0]
    after_h = ad.split(handlers_marker_end)
    ad = before_h + new_admin_handlers + "\n  const handleDeleteUser = async (userId, userName) => {" + after_h

moderation_marker = "{/* AI MODERATION */}"
if moderation_marker in ad:
    before_mod = ad.split(moderation_marker)[0]
    
    verif_tab_and_moderation = """{/* 3. STUDENT ID & GOVT ID VERIFICATIONS REVIEW QUEUE */}
      {activeTab === 'verifications' && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <span>Student ID & Government Identity Verification Queue</span>
              </h3>
              <p className="text-xs text-slate-400">Review student ID proofs and Government Photo IDs independently to grant verified status.</p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
              Total Submissions: {verifications.length}
            </span>
          </div>

          {verifications.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500 bg-slate-950/40 border border-slate-900 rounded-2xl">
              No verification requests submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {verifications.map((v) => (
                <div key={v.id} className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-900 pb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                        <span>{v.user?.fullName || 'Student'}</span>
                        <span className="text-xs font-normal text-slate-400">(@{v.user?.username})</span>
                      </h4>
                      <p className="text-xs text-indigo-400 font-semibold mt-0.5">{v.collegeName || v.user?.profile?.college || 'College Student'}</p>
                      <p className="text-xs text-slate-500">{v.user?.email}</p>
                    </div>
                    <span className="text-xs text-slate-500">Submitted: {new Date(v.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Dual Document Review Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* 1. College Student ID Card Review */}
                    <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black uppercase text-indigo-400 flex items-center space-x-1.5">
                            <GraduationCap className="w-4 h-4" />
                            <span>1. College Student ID</span>
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border ${
                            v.collegeIdStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            v.collegeIdStatus === 'PENDING' && v.idCardUrl ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse' :
                            v.idCardUrl ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}>
                            {v.idCardUrl ? (v.collegeIdStatus || 'PENDING') : 'Not Uploaded'}
                          </span>
                        </div>

                        {v.idCardUrl ? (
                          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group h-44 flex items-center justify-center">
                            <img src={v.idCardUrl} alt="College ID" className="w-full h-full object-contain cursor-pointer transition transform group-hover:scale-105" onClick={() => window.open(v.idCardUrl, '_blank')} />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                              <span className="text-xs font-bold text-white flex items-center space-x-1"><Eye className="w-4 h-4" /><span>View Full College ID</span></span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-44 flex items-center justify-center text-xs text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800/40">Student has not uploaded College ID</div>
                        )}
                        {v.collegeRejectionReason && <p className="text-xs text-red-400 font-bold">Reason: {v.collegeRejectionReason}</p>}
                      </div>

                      {v.idCardUrl && (
                        <div className="flex space-x-2 pt-2">
                          <button onClick={() => handleApproveVerification(v.id, 'COLLEGE')} disabled={v.collegeIdStatus === 'APPROVED'} className={`flex-1 py-2 text-xs font-black rounded-xl transition ${v.collegeIdStatus === 'APPROVED' ? 'bg-emerald-900/40 text-emerald-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'}`}>
                            {v.collegeIdStatus === 'APPROVED' ? '✓ Approved' : 'Approve College ID'}
                          </button>
                          <button onClick={() => handleRejectVerification(v.id, 'COLLEGE')} className="px-3 py-2 bg-red-950/50 hover:bg-red-900/80 border border-red-800 text-red-300 text-xs font-bold rounded-xl transition">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 2. Government Identity ID Review */}
                    <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black uppercase text-violet-400 flex items-center space-x-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            <span>2. Government Identity ID</span>
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border ${
                            v.govtIdStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            v.govtIdStatus === 'PENDING' && v.nationalIdUrl ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse' :
                            v.nationalIdUrl ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}>
                            {v.nationalIdUrl ? (v.govtIdStatus || 'PENDING') : 'Not Uploaded'}
                          </span>
                        </div>

                        {v.nationalIdUrl ? (
                          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group h-44 flex items-center justify-center">
                            <img src={v.nationalIdUrl} alt="Government ID" className="w-full h-full object-contain cursor-pointer transition transform group-hover:scale-105" onClick={() => window.open(v.nationalIdUrl, '_blank')} />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                              <span className="text-xs font-bold text-white flex items-center space-x-1"><Eye className="w-4 h-4" /><span>View Full Govt ID</span></span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-44 flex items-center justify-center text-xs text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800/40">Student has not uploaded Govt ID</div>
                        )}
                        {v.govtRejectionReason && <p className="text-xs text-red-400 font-bold">Reason: {v.govtRejectionReason}</p>}
                      </div>

                      {v.nationalIdUrl && (
                        <div className="flex space-x-2 pt-2">
                          <button onClick={() => handleApproveVerification(v.id, 'GOVT')} disabled={v.govtIdStatus === 'APPROVED'} className={`flex-1 py-2 text-xs font-black rounded-xl transition ${v.govtIdStatus === 'APPROVED' ? 'bg-emerald-900/40 text-emerald-500 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg'}`}>
                            {v.govtIdStatus === 'APPROVED' ? '✓ Approved' : 'Approve Govt ID'}
                          </button>
                          <button onClick={() => handleRejectVerification(v.id, 'GOVT')} className="px-3 py-2 bg-red-950/50 hover:bg-red-900/80 border border-red-800 text-red-300 text-xs font-bold rounded-xl transition">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI MODERATION */}"""
    after_mod = ad.split(moderation_marker)
    ad = before_mod + verif_tab_and_moderation + after_mod
    with open(admin_path, 'w') as f:
        f.write(ad)
    print('✅ Updated AdminDashboard.jsx with independent dual document review cards!')

