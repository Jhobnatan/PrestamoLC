const { conexion } = require("../config");
const mysql = require('mysql');

const localConnection = mysql.createPool({
	...conexion,
	dateStrings: "date"
});

const localQuery = (query,params) => new Promise((resolve, reject) => {
	localConnection.query(query,[params], (error, rows, fields) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(rows);
	});
});

module.exports = {
	localConnection,
	localQuery,
};