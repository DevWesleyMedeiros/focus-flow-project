// Serviço de envio de e-mails com guard de ambiente (não envia e-mails reais em dev sem credenciais)
// Segue o mesmo padrão de inicialização protegido do Firebase Admin e Cloudinary

type MailData = {
  to: string;
  subject: string;
  html: string;
};

// Inicialização lazy com verificação de variáveis de ambiente
const mailService = (() => {
  const isEnabled = !!process.env['RESEND_API_KEY'] && !!process.env['MAIL_FROM'];

  async function sendEmail(_mailData: MailData): Promise<boolean> {
    // Se as credenciais não existirem, apenas loga e retorna sucesso (não quebra a aplicação)
    if (!isEnabled) {
      console.log(
        "[mailService] E-mail não enviado (serviço desativado por falta de credenciais):",
        _mailData,
      );
      return true;
    }

    // Implementação real com Resend (se as credenciais existirem)
    try {
      const mod = (await import("resend")) as any;
      const Resend = mod?.Resend ?? mod;
      const resend = new Resend(process.env['RESEND_API_KEY']);
      await resend.emails.send({
        from: process.env['MAIL_FROM']!,
        to: _mailData.to,
        subject: _mailData.subject,
        html: _mailData.html,
      });
      return true;
    } catch (err) {
      console.error("[mailService] Erro ao enviar e-mail:", err);
      return false;
    }
  }

  return { sendEmail };
})();

export { mailService };
