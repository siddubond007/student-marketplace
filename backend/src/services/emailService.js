const sendPasswordResetEmail = async ({ to, name, resetLink, expiresAt }) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('Password reset email not sent: RESEND_API_KEY is not configured.');
    return { sent: false };
  }

  const from = process.env.RESEND_FROM_EMAIL || 'SkillLaunch <onboarding@resend.dev>';
  const expiresText = new Date(expiresAt).toLocaleString();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:32px;background:#0f172a;color:#e2e8f0;border-radius:18px">
      <h1 style="margin:0 0 12px;color:#ffffff">Reset your SkillLaunch password</h1>
      <p style="line-height:1.6">Hi ${name || 'there'}, we received a request to reset your SkillLaunch account password.</p>
      <p style="line-height:1.6">This link expires at ${expiresText}.</p>
      <p style="margin:28px 0">
        <a href="${resetLink}" style="display:inline-block;padding:12px 18px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700">Reset Password</a>
      </p>
      <p style="font-size:12px;color:#94a3b8">If you did not request this, you can ignore this email.</p>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Reset your SkillLaunch password',
      html
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Email provider rejected the request: ${response.status} ${errorText}`);
  }

  return { sent: true, provider: 'resend' };
};

module.exports = { sendPasswordResetEmail };
