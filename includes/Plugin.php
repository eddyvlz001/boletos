<?php
namespace SistemaContratos;

class Plugin {
    protected $loader;
    protected $plugin_name;
    protected $version;

    public function __construct() {
        $this->version = SC_VERSION;
        $this->plugin_name = 'sistema-contratos';
        
        $this->load_dependencies();
        $this->set_locale();
        $this->define_admin_hooks();
        $this->define_public_hooks();
    }

    private function load_dependencies() {
        require_once SC_PLUGIN_DIR . 'includes/Loader.php';
        require_once SC_PLUGIN_DIR . 'includes/I18n.php';
        require_once SC_PLUGIN_DIR . 'includes/Admin/Admin.php';
        require_once SC_PLUGIN_DIR . 'includes/Frontend/Frontend.php';
        
        $this->loader = new Loader();
    }

    private function set_locale() {
        $plugin_i18n = new I18n();
        $this->loader->add_action('plugins_loaded', $plugin_i18n, 'load_plugin_textdomain');
    }

    private function define_admin_hooks() {
        $plugin_admin = new Admin\Admin($this->get_plugin_name(), $this->get_version());

        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_styles');
        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts');
        $this->loader->add_action('admin_menu', $plugin_admin, 'add_menu_pages');
        
        // AJAX handlers
        $this->loader->add_action('wp_ajax_sc_save_contract', $plugin_admin, 'save_contract');
        $this->loader->add_action('wp_ajax_sc_get_contracts', $plugin_admin, 'get_contracts');
    }

    private function define_public_hooks() {
        $plugin_public = new Frontend\Frontend($this->get_plugin_name(), $this->get_version());

        $this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_styles');
        $this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_scripts');
    }

    public function run() {
        $this->loader->run();
    }

    public function get_plugin_name() {
        return $this->plugin_name;
    }

    public function get_version() {
        return $this->version;
    }
}