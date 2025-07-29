<?php
/**
 * Plugin Name: Sistema de Contratos
 * Plugin URI: https://github.com/yourusername/sistema-contratos
 * Description: Sistema de gestión de contratos, órdenes de trabajo y rifas
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: sistema-contratos
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('SC_VERSION', '1.0.0');
define('SC_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('SC_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include required files
require_once SC_PLUGIN_DIR . 'includes/class-sc-activator.php';
require_once SC_PLUGIN_DIR . 'includes/class-sc-deactivator.php';
require_once SC_PLUGIN_DIR . 'includes/class-sc-loader.php';
require_once SC_PLUGIN_DIR . 'includes/class-sc-i18n.php';
require_once SC_PLUGIN_DIR . 'includes/class-sc-admin.php';
require_once SC_PLUGIN_DIR . 'includes/class-sc-public.php';

// Register activation and deactivation hooks
register_activation_hook(__FILE__, array('SC_Activator', 'activate'));
register_deactivation_hook(__FILE__, array('SC_Deactivator', 'deactivate'));

/**
 * Begin execution of the plugin
 */
function run_sistema_contratos() {
    $plugin = new SC_Loader();
    $plugin->run();
}
run_sistema_contratos();