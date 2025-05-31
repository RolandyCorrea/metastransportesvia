// Formatea números como moneda peruana
function formatoSoles(valor) {
  return valor.toLocaleString('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  });
}

async function cargarDatos() {
  const panel = document.getElementById('panelAgencias');
  panel.innerHTML = '';

  const resMetas = await fetch('datos/metas.json');
  const metas = await resMetas.json();

  const resVentas = await fetch('datos/ventas.json');
  const ventas = await resVentas.json();

  const hoy = new Date().toISOString().slice(0, 10);

  for (const agencia in metas) {
    const meta = metas[agencia];
    const ventasAgencia = ventas[agencia] || [];

    let acumulado = ventasAgencia.reduce((suma, venta) => suma + venta.monto, 0);
    let vendidoHoy = 0;

    ventasAgencia.forEach(v => {
      if (v.fecha === hoy) vendidoHoy += v.monto;
    });

    const faltante = Math.max(meta - acumulado, 0);
    const porcentaje = Math.min((acumulado / meta) * 100, 100).toFixed(1);

    const card = document.createElement('div');
    card.className = 'agencia-card';
    card.innerHTML = `
      <h3>${agencia}</h3>
      <p><strong>Meta:</strong> ${formatoSoles(meta)}</p>
      <p><strong>Acumulado:</strong> ${formatoSoles(acumulado)}</p>
      <p><strong>Vendido hoy:</strong> ${formatoSoles(vendidoHoy)}</p>
      <div class="progress-bar">
        <div class="progress-bar-fill" style="width: ${porcentaje}%;">${porcentaje}%</div>
      </div>
      <p><strong>Faltan:</strong> ${formatoSoles(faltante)}</p>
    `;
    panel.appendChild(card);
  }
}

cargarDatos();

