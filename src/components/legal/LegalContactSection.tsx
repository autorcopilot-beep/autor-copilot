export function LegalContactSection() {
  return (
    <section className="mt-16 border-t border-line pt-8 text-sm text-muted">
      <p className="font-medium text-ink">Dúvidas?</p>
      <p className="mt-1">
        Questões sobre privacidade e proteção de dados:{" "}
        <a className="text-accent underline underline-offset-2" href="mailto:privacidade@autorcopilot.com.br">
          privacidade@autorcopilot.com.br
        </a>
      </p>
      <p className="mt-1">
        Demais questões legais e contratuais:{" "}
        <a className="text-accent underline underline-offset-2" href="mailto:juridico@autorcopilot.com.br">
          juridico@autorcopilot.com.br
        </a>
      </p>
    </section>
  );
}
