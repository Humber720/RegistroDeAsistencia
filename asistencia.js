document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("asistenciaForm");
  const loading = document.getElementById("loading");
  const modalExito = document.getElementById("modalExito");
  const btnDescargar = document.getElementById("btnDescargar");
  const btnCerrar = document.getElementById("btnCerrar");

  const SHEET_URL = "https://api.sheetbest.com/sheets/55a0aaa8-ec4b-4f46-b5ce-eb56cbd66591";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    loading.style.display = "block";

    const nombre = document.getElementById("nombre").value.trim();
    const curso = document.getElementById("curso").value.trim();
    const codigo = document.getElementById("codigo").value.trim();
    const fechaHora = new Date().toLocaleString("es-BO", {
      dateStyle: "long",
      timeStyle: "medium"
    });

    const data = { Nombre: nombre, Curso: curso, Codigo: codigo, Fecha: fechaHora };

    try {
      const response = await fetch(SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        loading.style.display = "none";
        modalExito.style.display = "flex";

        btnDescargar.onclick = () => generarPDF(nombre, curso, codigo, fechaHora);
        btnCerrar.onclick = () => {
          modalExito.style.display = "none";
          form.reset();
        };
      } else {
        alert("⚠️ Error al guardar los datos.");
      }
    } catch (error) {
      alert("❌ Error de conexión con la base de datos.");
      console.error(error);
    }
  });
});

// 🧾 Generador de PDF con soporte UTF-8 y estilo moderno
function generarPDF(nombre, curso, codigo, fechaHora) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Usa fuente Helvetica (sin errores de acento)
  doc.setFont("helvetica", "normal");

  // 🎨 Encabezado colorido
  doc.setFillColor(41, 128, 185); // Azul
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("COMPROBANTE DE ASISTENCIA", 105, 25, { align: "center" });

  // 🔹 Cuerpo con marco
  doc.setDrawColor(41, 128, 185);
  doc.roundedRect(15, 55, 180, 100, 5, 5);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);

  // 🧑 Datos
  doc.text("Nombre y Apellido:", 25, 75);
  doc.setFont("helvetica", "bold");
  doc.text(nombre, 80, 75);
  doc.setFont("helvetica", "normal");

  doc.text("Curso:", 25, 90);
  doc.setFont("helvetica", "bold");
  doc.text(curso, 80, 90);
  doc.setFont("helvetica", "normal");

  doc.text("Código de asistencia:", 25, 105);
  doc.setFont("helvetica", "bold");
  doc.text(codigo, 80, 105);
  doc.setFont("helvetica", "normal");

  doc.text("Fecha y hora:", 25, 120);
  doc.setFont("helvetica", "bold");
  doc.text(fechaHora, 80, 120);
  doc.setFont("helvetica", "normal");

  // ✍️ Pie de página
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Gracias por registrar tu asistencia.", 105, 165, { align: "center" });
  doc.text("Unidad Educativa T.H.P. Jupapina", 105, 172, { align: "center" });

  // 💾 Descargar
  doc.save(`Comprobante_Asistencia_${nombre.replaceAll(" ", "_")}.pdf`);
}

