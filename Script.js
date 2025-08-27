// Utilidad copiar
document.querySelectorAll('.copy').forEach(btn=>{
  btn.addEventListener('click',()=>{
	const sel = document.querySelector(btn.dataset.copy);
	navigator.clipboard.writeText(sel.innerText).then(()=>{
	  btn.textContent='Copiado'; setTimeout(()=>btn.textContent='Copiar',1200);
	});
  });
});

// DEMO 1: Definición / Clima
function demoClima(){
  const method = document.getElementById('httpMethod').value;
  const url = document.getElementById('endpoint').value;
  const log = document.getElementById('demoClimaLog');
  const base = { ciudad: 'Zarzal', temperatura: 29, estado: 'Soleado', unidad: '°C' };
  const respuesta = method==='GET' ? base : { status:'OK', recibido:{ ciudad:'Zarzal' }, createdAt:new Date().toISOString() };
  log.textContent = `> ${method} ${url} HTTP/1.1\n< 200 OK\n${JSON.stringify(respuesta,null,2)}`;
}

// DEMO 2: SOA orquestación
function simularSOA(){
  const steps = [
	'1) Servicio Estudiantes valida requisitos…',
	'2) Servicio Pagos registra consignación…',
	'3) Servicio Horarios asigna grupo…',
	'✔ Proceso completo: matrícula confirmada.'
  ];
  const log = document.getElementById('soaLog');
  log.textContent='';
  let i=0;
  const timer=setInterval(()=>{
	log.textContent += steps[i] + '\n';
	i++; if(i===steps.length) clearInterval(timer);
  }, 650);
}

// DEMO 3: Beneficios/Desafíos - latencia
function testLatencia(){
  const log = document.getElementById('latenciaLog');
  log.textContent = 'Invocando servicio…';
  const delay = Math.floor(Math.random()*1200)+300; // 300-1500ms
  const fallo = Math.random()<0.25; // 25% falla
  setTimeout(()=>{
	if(fallo){ log.textContent = '⛔ 504 Gateway Timeout — adoptar reintentos/backoff y circuit breaker.'; }
	else { log.textContent = `✅ 200 OK — respuesta en ${delay} ms`; }
  }, delay);
}

// DEMO 4: SOAP
function demoSOAP(){
  const log = document.getElementById('soapLog');
  const xml = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  <soap:Body>\n    <GetAlumnoResponse xmlns="http://ejemplo.edu/alumnos">\n      <alumno><id>1023</id><nombre>Ana</nombre></alumno>\n    </GetAlumnoResponse>\n  </soap:Body>\n</soap:Envelope>`;
  log.textContent = 'Enviando…\n' + xml;
}

// DEMO 5: REST
const store = {
  '/api/estudiantes/1023': { id:1023, nombre:'Ana', programa:'Sistemas' },
  '/api/estudiantes': [ {id:1001,nombre:'Luis'}, {id:1023,nombre:'Ana'} ]
};

function demoREST(){
  const m = document.getElementById('restMethod').value;
  const p = document.getElementById('restPath').value.trim();
  const bodyRaw = document.getElementById('restBody').value;
  const log = document.getElementById('restLog');
  try{
	if(m==='GET'){
	  if(store[p]) log.textContent = JSON.stringify(store[p],null,2);
	  else log.textContent = '404 Not Found';
	} else if(m==='POST'){
	  const data = JSON.parse(bodyRaw || '{}');
	  if(p==='/api/estudiantes'){
		data.id = data.id||Math.floor(Math.random()*9000)+1000;
		store['/api/estudiantes'].push({id:data.id,nombre:data.nombre});
		store[`/api/estudiantes/${data.id}`]=data;
		log.textContent = '201 Created\n' + JSON.stringify(data,null,2);
	  } else { log.textContent='400 Bad Request'; }
	} else if(m==='PUT'){
	  const data = JSON.parse(bodyRaw||'{}');
	  if(store[p]){ store[p] = {...store[p], ...data}; log.textContent = '200 OK\n'+JSON.stringify(store[p],null,2);} else { log.textContent='404 Not Found'; }
	} else if(m==='DELETE'){
	  if(store[p]){ delete store[p]; log.textContent='204 No Content'; } else { log.textContent='404 Not Found'; }
	}
  }catch(e){ log.textContent='Error de parseo JSON'; }
}

// DEMO 6: HTTP códigos
function httpStatus(code){
  const map = {200:'OK',404:'Not Found',500:'Internal Server Error'};
  document.getElementById('httpLog').textContent = `${code} ${map[code]}\nDate: ${new Date().toUTCString()}\nServer: demo/1.0`;
}

// DEMO 7: UDDI
function buscarUDDI(){
  const q = (document.getElementById('uddiQuery').value||'').toLowerCase();
  const registro = [
	{ nombre:'AlumnoWS', tipo:'SOAP', wsdl:'http://ejemplo.edu/ws/alumno?wsdl' },
	{ nombre:'PagosAPI', tipo:'REST', url:'http://ejemplo.edu/api/pagos' },
	{ nombre:'HorariosAPI', tipo:'REST', url:'http://ejemplo.edu/api/horarios' },
  ];
  const res = registro.filter(s=>s.nombre.toLowerCase().includes(q));
  document.getElementById('uddiLog').textContent = res.length? JSON.stringify(res,null,2) : 'Sin resultados';
}