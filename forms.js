// Captura genérica de leads: cualquier <form data-lead-form="origen"> con
// inputs/select/textarea con atributo "name" se envía a la tabla "leads"
// de Supabase, sin recargar la página.
(function () {
  if (typeof SUPABASE_URL === "undefined" || typeof SUPABASE_ANON_KEY === "undefined") return;
  if (typeof supabase === "undefined") return;

  var client;
  try {
    client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn("Supabase no configurado todavía (ver supabase-config.js):", err.message);
    return;
  }

  function attachForms() {
    document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
      var btn = form.querySelector('button[type="submit"]');
      var btnLabel = btn ? btn.textContent : "";
      var feedback = document.createElement("p");
      feedback.className = "form-feedback";
      form.appendChild(feedback);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var data = Object.fromEntries(new FormData(form).entries());

        if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }
        feedback.textContent = "";
        feedback.className = "form-feedback";

        client.from("leads").insert({
          source: form.dataset.leadForm,
          nombre: data.nombre || null,
          email: data.email || null,
          telefono: data.telefono || null,
          empresa: data.empresa || null,
          motivo: data.motivo || null,
          mensaje: data.mensaje || null,
          page_url: location.href
        }).then(function (res) {
          if (res.error) throw res.error;
          form.reset();
          feedback.textContent = "¡Listo! Ya quedó registrado, te escribimos pronto.";
          feedback.classList.add("ok");
        }).catch(function (err) {
          feedback.textContent = "Uy, algo falló. Probá de nuevo o escribinos a hola@manada.com.ar.";
          feedback.classList.add("err");
          console.error(err);
        }).finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachForms);
  } else {
    attachForms();
  }
})();
