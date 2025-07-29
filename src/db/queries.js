// Get database instance
var db = global.db;
// Cliente queries
export var getClientes = function () {
    return new Promise(function (resolve, reject) {
        db.all('SELECT * FROM clientes ORDER BY nombre', function (err, rows) {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
};
export var insertCliente = function (cliente) {
    return new Promise(function (resolve, reject) {
        var stmt = db.prepare("\n      INSERT INTO clientes (nombre, email, telefono, direccion, ciudad, codigo_postal)\n      VALUES (?, ?, ?, ?, ?, ?)\n    ");
        stmt.run(cliente.nombre, cliente.email, cliente.telefono, cliente.direccion, cliente.ciudad, cliente.codigoPostal, function (err) {
            if (err)
                reject(err);
            else
                resolve({ id: this.lastID });
        });
    });
};
// Add other query functions...
