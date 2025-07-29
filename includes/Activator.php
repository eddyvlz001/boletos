<?php
namespace SistemaContratos;

class Activator {
    public static function activate() {
        global $wpdb;
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        $charset_collate = $wpdb->get_charset_collate();

        // Create tables
        $sql = array();

        // Empresa table
        $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}sc_empresa (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            nombre varchar(255) NOT NULL,
            direccion text,
            telefono varchar(50),
            email varchar(100),
            logo text,
            qr text,
            numero_secuencial bigint(20) DEFAULT 1,
            PRIMARY KEY (id)
        ) $charset_collate;";

        // Clientes table
        $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}sc_clientes (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            nombre varchar(255) NOT NULL,
            email varchar(100),
            telefono varchar(50),
            direccion text,
            ciudad varchar(100),
            codigo_postal varchar(20),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";

        // Contratos table
        $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}sc_contratos (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            numero_contrato varchar(50) NOT NULL,
            fecha datetime DEFAULT CURRENT_TIMESTAMP,
            cliente_id bigint(20),
            tipo_evento varchar(50) NOT NULL,
            fecha_evento date,
            hora_inicio time,
            hora_fin time,
            ubicacion text,
            numero_invitados int,
            total decimal(10,2),
            anticipo decimal(10,2),
            saldo decimal(10,2),
            forma_pago varchar(50),
            estado varchar(50) DEFAULT 'pendiente',
            notas text,
            PRIMARY KEY (id),
            FOREIGN KEY (cliente_id) REFERENCES {$wpdb->prefix}sc_clientes(id)
        ) $charset_collate;";

        // Execute SQL
        foreach ($sql as $query) {
            dbDelta($query);
        }

        // Add version to options
        add_option('sc_version', SC_VERSION);

        // Create necessary directories
        $upload_dir = wp_upload_dir();
        $plugin_upload_dir = $upload_dir['basedir'] . '/sistema-contratos';
        
        if (!file_exists($plugin_upload_dir)) {
            wp_mkdir_p($plugin_upload_dir);
            wp_mkdir_p($plugin_upload_dir . '/logos');
            wp_mkdir_p($plugin_upload_dir . '/qr');
            wp_mkdir_p($plugin_upload_dir . '/temp');
        }

        // Create .htaccess to protect temp directory
        $htaccess = $plugin_upload_dir . '/temp/.htaccess';
        if (!file_exists($htaccess)) {
            $content = "Order deny,allow\nDeny from all\n";
            file_put_contents($htaccess, $content);
        }
    }
}