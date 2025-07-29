<?php
/**
 * Plugin Name: Sistema de Contratos
 * Plugin URI: https://github.com/yourusername/sistema-contratos
 * Description: Sistema de gestión de contratos, órdenes de trabajo y rifas
 * Version: 1.0.0
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: sistema-contratos
 * Domain Path: /languages
 */

// If this file is called directly, abort.
if (!defined('ABSPATH')) {
    die('Direct access is not allowed.');
}

// Plugin version
define('SC_VERSION', '1.0.0');
define('SC_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('SC_PLUGIN_URL', plugin_dir_url(__FILE__));
define('SC_PLUGIN_FILE', __FILE__);

// Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'SistemaContratos\\';
    $base_dir = SC_PLUGIN_DIR . 'includes/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// Activation
register_activation_hook(__FILE__, function() {
    require_once SC_PLUGIN_DIR . 'includes/Activator.php';
    SistemaContratos\Activator::activate();
});

// Deactivation
register_deactivation_hook(__FILE__, function() {
    require_once SC_PLUGIN_DIR . 'includes/Deactivator.php';
    SistemaContratos\Deactivator::deactivate();
});

// Initialize plugin
function init_sistema_contratos() {
    require_once SC_PLUGIN_DIR . 'includes/Plugin.php';
    $plugin = new SistemaContratos\Plugin();
    $plugin->run();
}
add_action('plugins_loaded', 'init_sistema_contratos');