import nodemailer from 'nodemailer';

export async function POST({ request }) {
  const form = await request.formData();
  const name = form.get('name');
  const email = form.get('email');
  const message = form.get('message');

  const transporter = nodemailer.createTransport({
    host: import.meta.env.MAIL_HOST,
    port: Number(import.meta.env.MAIL_PORT),
    secure: true,
    auth: {
      user: import.meta.env.MAIL_USER,
      pass: import.meta.env.MAIL_PASS,
    },
  });

  const html = `
    <h2>New Contact Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong><br/>${message}</p>
  `;

  await transporter.sendMail({
    from: import.meta.env.MAIL_USER,
    to: import.meta.env.MAIL_TO,
    subject: `New Contact from ${name}`,
    html,
  });

  return new Response(null, {
    status: 302,
    headers: {
      location: '/thanks', // redirect to a thank-you page
    },
  });
}
