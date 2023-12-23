
const nodemailer = require("nodemailer");
const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");
const fs = require("fs");
const format = require('string-template');

const send_mail = function (
	mail_to,
	mail_subject,
	mail_title,
	mail_message,
	fid_data
  ) {
	return new Promise(function (resolve, reject) {
	  nodemailer.createTestAccount(function (error) {
		var transporter = nodemailer.createTransport({
		  host: "mail.americanfidelium.com",
		  port: 587,
		  secure: false,
		  auth: {
			user: "jrosario@americanfidelium.com",
			pass: "2013@anwebpointMCD"
		  },
		  tls: {
			rejectUnauthorized: false
		  }
		});
  
		var readHtml = "";
		var info = {};
  
		// if (mail_type == "contact") {
		//   readHtml = fs.readFileSync("./mail_web.html");
		//   info = {
		// 	titulo: mail_title,
		// 	mensaje_principal: mail_message,
		// 	nombre: fid_data.nombre,
		// 	email: fid_data.email,
		// 	telefono: fid_data.telefono,
		// 	mensaje: fid_data.mensaje,
		// 	motivo: fid_data.motivo
		//   };
		// } else if (mail_type == "pin") {
		//   readHtml = fs.readFileSync("./mail_pin.html");
		//   info = {
		// 	titulo: mail_title,
		// 	mensaje_principal: mail_message,
		// 	name: fid_data.name,
		// 	cardnum: fid_data.cardnum,
		// 	phone: fid_data.phone
		//   };
		// } else {
		//   return;
		// }
		readHtml = fs.readFileSync("./public/assets/mail_web.html");
		  info = {
			titulo: mail_title,
			mensaje_principal: mail_message,
			// nombre: fid_data.nombre,
			// email: fid_data.email,
			// telefono: fid_data.telefono,
			// mensaje: fid_data.mensaje,
			// motivo: fid_data.motivo
		};
		// console.log("HTML: " + readHtml);
  
		var newHtml = format(readHtml.toString(), info);
		// var newHtml = readHtml;
		var mailOptions = {
		  from: "jrosario@americanfidelium.com",
		  to: mail_to,
		//   cc: mails_cc,
		  subject: mail_subject,
		  text: "",
		  html: newHtml,
		//   attachments: [
		// 	{
		// 	  filename: "mail_banner.png",
		// 	  path: "./public/imagenes/mail_banner.png",
		// 	  cid: "mail_banner.png"
		// 	},
		// 	{
		// 	  filename: "fidelium_card1.png",
		// 	  path: "./public/imagenes/fidelium_card1.png",
		// 	  cid: "fidelium_card1.png"
		// 	}
		//   ]
		};
  
		transporter.sendMail(mailOptions, function (error, info) {
		  if (error) {
			reject(error.message);
		  }
		  resolve(
			"Message sent: " +
			JSON.stringify(info) +
			" \n Preview URL: " +
			nodemailer.getTestMessageUrl(info)
		  );
		});
	  });
	});
  };

  const notificiaciones_list = () => new Promise((resolve, reject) => {
		let ejecutivointerno = 'SELECT `id_empleado`, `nombres`,concat(`nombres`," ",`apellidos`) AS ejecutivointerno FROM `jr_empleado` WHERE `id_departamento` = 4';
		let ejecutivo_externo = 'SELECT ee.`id_ejecutivo`, ee.`nombre`,e.`nombre_empresa` FROM `jr_ejecutivo_externo` ee, `jr_empresa` e WHERE ee.`id_empresa` = e.`id_empresa` AND `estado` = "Activo" AND e.`id_categoria` = 1';
		let ejecutivo_pago = 'SELECT ee.`id_ejecutivo`, ee.`nombre`,e.`nombre_empresa` FROM `jr_ejecutivo_externo` ee, `jr_empresa` e WHERE ee.`id_empresa` = e.`id_empresa` AND `estado` = "Activo" AND e.`id_categoria` = 2';
		let citas = 'SELECT `id_cita`, `titulo`, `fecha`, `hora_inicio`, `hora_fin`, `color`, `motivo`, `estado`, `recordatorio`, `minuta`, `fecha_registro`, `registrada_por`, `lugar`, `geo` FROM `jr_cita` WHERE `estado` <> "Cancelada" AND `fecha` = CURDATE() ORDER BY `fecha` ASC';

		Promise.all([
			localQuery(ejecutivointerno,),
			localQuery(ejecutivo_externo,),
			localQuery(ejecutivo_pago,),
			localQuery(citas,),
		]).then(data => {
			// console.log(data)
			resolve(data);

		}, reject => {
			// res.status(500).send({ error: errors.DB_ERROR });
			console.log("No se pudo cargar información de formulario. " + reject);
		});
	})

	const vencimiento_registro_mercantil_list = () => new Promise((resolve, reject) => {
		
		let vencimiento_registro = 'SELECT `id_negocio`, `razon_social`, `rnc`, `rm_vence` AS fecha_registro_mercantil, DATE(NOW()) AS fecha_actual ,DATE_ADD(`rm_vence`, INTERVAL -1 MONTH ) AS compara_fecha FROM `jr_negocio_general` WHERE DATE(NOW()) >= DATE_ADD(`rm_vence`, INTERVAL -1 MONTH )';

		Promise.all([
			localQuery(vencimiento_registro,),
		]).then(data => {
			// console.log(data)
			resolve(data);

		}, reject => {
			// res.status(500).send({ error: errors.DB_ERROR });
			console.log("No se pudo cargar información de formulario. " + reject);
		});
	})

	const lista_correo_finanza = () => new Promise((resolve, reject) => {
		let query = 'SELECT emp.`email_institucional` FROM `jr_recibir_correo_vs_empleado` rce, `jr_empleado` emp WHERE rce.`id_empleado` = emp.`id_empleado` AND emp.`id_estado` IN (2,5) AND rce.`id_recibir` = 1;';
	
		localConnection.query(query, (error, lista) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(lista);
		});
	});
	
	const lista_correo_crear_sucursal = () => new Promise((resolve, reject) => {
		let query = 'SELECT emp.`email_institucional` FROM `jr_recibir_correo_vs_empleado` rce, `jr_empleado` emp WHERE rce.`id_empleado` = emp.`id_empleado` AND emp.`id_estado` IN (2,5) AND rce.`id_recibir` = 2;';
	
		localConnection.query(query, (error, lista) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(lista);
		});
	});
	const lista_correo_operaciones = () => new Promise((resolve, reject) => {
		let query = 'SELECT emp.`email_institucional` FROM `jr_recibir_correo_vs_empleado` rce, `jr_empleado` emp WHERE rce.`id_empleado` = emp.`id_empleado` AND emp.`id_estado` IN (2,5) AND rce.`id_recibir` = 3;';
	
		localConnection.query(query, (error, lista) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(lista);
		});
	});
	//
	const lista_correo_mercadeo = () => new Promise((resolve, reject) => {
		let query = 'SELECT emp.`email_institucional` FROM `jr_recibir_correo_vs_empleado` rce, `jr_empleado` emp WHERE rce.`id_empleado` = emp.`id_empleado` AND emp.`id_estado` IN (2,5) AND rce.`id_recibir` = 4;';
	
		localConnection.query(query, (error, lista) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(lista);
		});
	});
	//
	const lista_correo_comercial = () => new Promise((resolve, reject) => {
		let query = 'SELECT emp.`email_institucional` FROM `jr_recibir_correo_vs_empleado` rce, `jr_empleado` emp WHERE rce.`id_empleado` = emp.`id_empleado` AND emp.`id_estado` IN (2,5) AND rce.`id_recibir` = 5;';
	
		localConnection.query(query, (error, lista) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(lista);
		});
	});
	const lista_correo_registro_mercantil_vence = () => new Promise((resolve, reject) => {
		let query = 'SELECT emp.`email_institucional` FROM `jr_recibir_correo_vs_empleado` rce, `jr_empleado` emp WHERE rce.`id_empleado` = emp.`id_empleado` AND emp.`id_estado` IN (2,5) AND rce.`id_recibir` = 6;';
	
		localConnection.query(query, (error, lista) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(lista);
		});
	});

	const correo_empleado = (id_empleado) => new Promise((resolve, reject) => {
		// Informacion del portador.
		let query ="SELECT `email_institucional` FROM `jr_empleado` WHERE `id_estado` = 2 AND `id_empleado` = ?;";
	
		localConnection.query(query,id_empleado, (error, emp) => {
			// console.log(error);
			if (error) {
				console.log(error)
				reject(error);
				return;
			}
			// console.log(rows)
			resolve(emp);
		});
	});

module.exports = {
	send_mail,
	correo_empleado,
	notificiaciones_list,
	vencimiento_registro_mercantil_list,
	lista_correo_finanza,
	lista_correo_crear_sucursal,
	lista_correo_operaciones,
	lista_correo_mercadeo,
	lista_correo_comercial,
	lista_correo_registro_mercantil_vence
};