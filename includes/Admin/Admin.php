<?php
namespace SistemaContratos\Admin;

class Admin {
    private $plugin_name;
    private $version;

    public function __construct($plugin_name, $version) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    public function enqueue_styles() {
        wp_enqueue_style(
            $this->plugin_name,
            SC_PLUGIN_URL . 'admin/css/sistema-contratos-admin.css',
            array(),
            $this->version,
            'all'
        );
    }

    public function enqueue_scripts() {
        wp_enqueue_script(
            $this->plugin_name,
            SC_PLUGIN_URL . 'admin/js/sistema-contratos-admin.js',
            array('jquery'),
            $this->version,
            false
        );

        wp_localize_script(
            $this->plugin_name,
            'scAjax',
            array(
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('sistema-contratos-nonce')
            )
        );
    }

    public function add_menu_pages() {
        add_menu_page(
            __('Sistema de Contratos', 'sistema-contratos'),
            __('Contratos', 'sistema-contratos'),
            'manage_options',
            'sistema-contratos',
            array($this, 'display_main_page'),
            'dashicons-clipboard',
            30
        );

        add_submenu_page(
            'sistema-contratos',
            __('Nuevo Contrato', 'sistema-contratos'),
            __('Nuevo Contrato', 'sistema-contratos'),
            'manage_options',
            'sc-nuevo-contrato',
            array($this, 'display_nuevo_contrato_page')
        );

        add_submenu_page(
            'sistema-contratos',
            __('Órdenes de Trabajo', 'sistema-contratos'),
            __('Órdenes de Trabajo', 'sistema-contratos'),
            'manage_options',
            'sc-ordenes',
            array($this, 'display_ordenes_page')
        );

        add_submenu_page(
            'sistema-contratos',
            __('Configuración', 'sistema-contratos'),
            __('Configuración', 'sistema-contratos'),
            'manage_options',
            'sc-configuracion',
            array($this, 'display_configuracion_page')
        );
    }

    public function display_main_page() {
        require_once SC_PLUGIN_DIR . 'admin/partials/main-page.php';
    }

    public function display_nuevo_contrato_page() {
        require_once SC_PLUGIN_DIR . 'admin/partials/nuevo-contrato.php';
    }

    public function display_ordenes_page() {
        require_once SC_PLUGIN_DIR . 'admin/partials/ordenes.php';
    }

    public function display_configuracion_page() {
        require_once SC_PLUGIN_DIR . 'admin/partials/configuracion.php';
    }
}